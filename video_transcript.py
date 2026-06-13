from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

def get_transcript(url: str) -> str:
    """Extract transcript from YouTube video and save to doc.txt"""
    video_id = parse_qs(urlparse(url).query)["v"][0]
    
    ytt_api = YouTubeTranscriptApi()
    transcript = ytt_api.fetch(video_id)
    
    text = " ".join([snippet.text for snippet in transcript])
    
    with open("doc.txt", "w", encoding="utf-8") as f:
        f.write(text)
    
    return text

