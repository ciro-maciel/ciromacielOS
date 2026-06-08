#!/usr/bin/env python3
"""Single-video YouTube uploader via Data API v3. Resumable upload.

First run triggers OAuth browser flow; token is cached in --token path.
Outputs JSON to stdout on success: {"id","url","status","title"}.
"""
import argparse, json, os, sys
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
]


def get_credentials(creds_path: str, token_path: str):
    creds = None
    if os.path.exists(token_path):
        try:
            creds = Credentials.from_authorized_user_file(token_path, SCOPES)
        except Exception:
            creds = None
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(
                port=0,
                open_browser=False,
                authorization_prompt_message=(
                    "\n=== ABRA NO BROWSER ===\n{url}\n=======================\n"
                    "Depois de autorizar, o script continua automaticamente.\n"
                ),
                success_message="Autorização recebida. Pode fechar essa aba.",
            )
        with open(token_path, "w") as f:
            f.write(creds.to_json())
        os.chmod(token_path, 0o600)
    return creds


def upload(args, creds):
    youtube = build("youtube", "v3", credentials=creds, cache_discovery=False)
    snippet = {
        "title": args.title,
        "description": args.description,
        "tags": [t.strip() for t in args.tags.split(",") if t.strip()] if args.tags else [],
        "categoryId": str(args.category),
        "defaultLanguage": args.language,
        "defaultAudioLanguage": args.language,
    }
    status = {
        "privacyStatus": args.privacy,
        "madeForKids": args.made_for_kids,
        "selfDeclaredMadeForKids": args.made_for_kids,
        "embeddable": True,
        "license": "youtube",
    }
    if args.publish_at and args.privacy == "private":
        status["publishAt"] = args.publish_at
    body = {"snippet": snippet, "status": status}

    media = MediaFileUpload(args.video, chunksize=4 * 1024 * 1024, resumable=True, mimetype="video/mp4")
    req = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        prog, response = req.next_chunk()
        if prog:
            print(f"  [{os.path.basename(args.video)}] {int(prog.progress()*100)}%", file=sys.stderr, flush=True)
    return response


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--description", required=True)
    ap.add_argument("--tags", default="")
    ap.add_argument("--category", type=int, default=27)  # 27 = Education
    ap.add_argument("--privacy", choices=["public", "private", "unlisted"], default="public")
    ap.add_argument("--publish-at", default=None, help="ISO 8601 UTC; only used with --privacy=private")
    ap.add_argument("--made-for-kids", action="store_true")
    ap.add_argument("--language", default="pt-BR")
    ap.add_argument("--credentials", default=os.path.expanduser("~/.ciromacielos/google-cloud/yt-upload-credentials.json"))
    ap.add_argument("--token", default=os.path.expanduser("~/.ciromacielos/google-cloud/yt-upload-token.json"))
    args = ap.parse_args()

    creds = get_credentials(args.credentials, args.token)
    response = upload(args, creds)
    out = {
        "id": response["id"],
        "url": f"https://www.youtube.com/watch?v={response['id']}",
        "status": response.get("status", {}),
        "title": response.get("snippet", {}).get("title"),
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except HttpError as e:
        print(f"YT API error: {e}", file=sys.stderr)
        sys.exit(1)
