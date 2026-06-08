#!/usr/bin/env python3
"""Set custom thumbnail on a YouTube video via Data API v3.
Uses cached OAuth token (already authorized via yt-upload.py)."""
import argparse
import os
import sys
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
]


def get_credentials(token_path: str):
    creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(token_path, "w") as f:
            f.write(creds.to_json())
    return creds


def set_thumbnail(video_id: str, image_path: str, creds):
    youtube = build("youtube", "v3", credentials=creds, cache_discovery=False)
    media = MediaFileUpload(image_path, mimetype="image/png", resumable=False)
    response = youtube.thumbnails().set(videoId=video_id, media_body=media).execute()
    return response


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video-id", required=True)
    ap.add_argument("--image", required=True)
    ap.add_argument("--token", default=os.path.expanduser("~/.ciromacielos/google-cloud/yt-upload-token.json"))
    args = ap.parse_args()

    creds = get_credentials(args.token)
    try:
        resp = set_thumbnail(args.video_id, args.image, creds)
        print(f"OK {args.video_id} ← {os.path.basename(args.image)}")
        if "items" in resp:
            for it in resp["items"]:
                if "default" in it:
                    print(f"   default: {it['default'].get('url')}")
    except HttpError as e:
        print(f"FAIL {args.video_id}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
