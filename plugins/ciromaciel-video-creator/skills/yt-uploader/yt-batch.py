#!/usr/bin/env python3
"""Orquestra uploads de YouTube em sequência a partir de batch.json.

Cada item do batch é uma definição de video (path + metadata). Pula items
já marcados como done em results.json (idempotente — pode re-rodar).

Usage:
    yt-batch.py --batch <path/to/batch.json> [--results <path>] [--thumbs <dir>]

batch.json schema (lista de objetos):
    [
      {
        "id": "<unique-id>",                  # required — chave de dedup
        "video": "<absolute path .mp4>",      # required
        "title": "<str>",                     # required
        "description": "<str>",               # required
        "tags": "<comma-separated>",          # optional
        "category": 27,                       # optional, default 27 = Education
        "privacy": "public",                  # optional, default public
        "publish_at": "2026-05-30T18:00:00Z", # optional ISO UTC; só usado com privacy=private
        "thumbnail": "<absolute path .png>",  # optional — se setado, sobe thumb após upload
        "made_for_kids": false                # optional, default false
      },
      ...
    ]

results.json (gerado/atualizado): lista de { id, response: { id, url, status, title } }
ou { id, error: "..." } pra falhas. Re-running com mesmo batch.json pula items
que já têm response.
"""
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

DEFAULT_VENV_PYTHON = os.path.expanduser("~/.ciromacielos/google-cloud/venv/bin/python")
SCRIPT_DIR = Path(__file__).parent
UPLOAD = str(SCRIPT_DIR / "yt-upload.py")
THUMBNAIL = str(SCRIPT_DIR / "yt-thumbnail.py")


def load_results(path: str) -> list:
    if not os.path.exists(path):
        return []
    try:
        return json.load(open(path))
    except Exception:
        return []


def save_results(results: list, path: str):
    with open(path, "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)


def already_done(item_id, results: list) -> bool:
    for r in results:
        if r.get("id") == item_id and r.get("response", {}).get("id"):
            return True
    return False


def run_upload(py: str, item: dict) -> tuple[int, str, str]:
    cmd = [
        py, UPLOAD,
        "--video", item["video"],
        "--title", item["title"],
        "--description", item["description"],
        "--tags", item.get("tags", ""),
        "--category", str(item.get("category", 27)),
        "--privacy", item.get("privacy", "public"),
    ]
    if item.get("publish_at") and item.get("privacy") == "private":
        cmd += ["--publish-at", item["publish_at"]]
    if item.get("made_for_kids"):
        cmd += ["--made-for-kids"]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    return proc.returncode, proc.stdout, proc.stderr


def run_thumbnail(py: str, video_id: str, image: str) -> tuple[int, str, str]:
    cmd = [py, THUMBNAIL, "--video-id", video_id, "--image", image]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    return proc.returncode, proc.stdout, proc.stderr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", required=True, help="Path to batch.json")
    ap.add_argument("--results", default=None, help="Path to results.json (default: <batch>.results.json)")
    ap.add_argument("--python", default=DEFAULT_VENV_PYTHON, help="Python interpreter (default: venv)")
    args = ap.parse_args()

    batch = json.load(open(args.batch))
    results_path = args.results or args.batch.replace(".json", ".results.json")
    results = load_results(results_path)
    done_ids = {r["id"] for r in results if r.get("response", {}).get("id")}

    todo = [it for it in batch if it["id"] not in done_ids]
    print(f"=== batch: {len(todo)} pendentes (de {len(batch)} total) ===", flush=True)
    if not todo:
        print("Nada a fazer. Tudo já está em results.")
        return

    for item in todo:
        item_id = item["id"]
        video_path = item["video"]
        print(f"\n=== [{item_id}] {os.path.basename(video_path)} ===", flush=True)

        rc, out, err = run_upload(args.python, item)
        if rc != 0:
            print(f"UPLOAD FAIL: {err}", file=sys.stderr, flush=True)
            results.append({"id": item_id, "error": err, "stdout": out})
            save_results(results, results_path)
            continue
        try:
            response = json.loads(out)
        except Exception:
            response = {"raw_stdout": out}
        print(json.dumps(response, ensure_ascii=False, indent=2), flush=True)
        record = {"id": item_id, "response": response}

        thumb = item.get("thumbnail")
        if thumb and response.get("id"):
            print(f"  → setting thumbnail {os.path.basename(thumb)}", flush=True)
            trc, tout, terr = run_thumbnail(args.python, response["id"], thumb)
            if trc == 0:
                record["thumbnail_set"] = True
                print(f"  ✓ {tout.strip()}", flush=True)
            else:
                record["thumbnail_set"] = False
                record["thumbnail_error"] = terr
                print(f"  ✗ thumbnail FAIL: {terr}", file=sys.stderr, flush=True)

        results.append(record)
        save_results(results, results_path)

    print(f"\n=== done. results em {results_path} ===", flush=True)


if __name__ == "__main__":
    main()
