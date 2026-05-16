from fastapi import APIRouter, Query
from services.parser import (
    get_all_talks,
    get_talks_by_day,
    get_talks_by_track,
    get_talk_by_id,
    search_talks,
)
from services.llm import analyze_talk

router = APIRouter()


@router.get("/")
def list_talks(
    day: str = Query(None),
    track: str = Query(None),
    q: str = Query(None),
):
    if q:
        return search_talks(q)
    if day:
        return get_talks_by_day(day)
    if track:
        return get_talks_by_track(track)
    return get_all_talks()


@router.get("/tracks")
def list_tracks():
    all_talks = get_all_talks()
    tracks = list(set(t["track"] for t in all_talks))
    return sorted(tracks)


@router.get("/days")
def list_days():
    return ["Friday", "Saturday", "Sunday"]


@router.get("/{talk_id}")
def get_talk(talk_id: str):
    talk = get_talk_by_id(talk_id)
    if not talk:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Talk not found")
    return talk


@router.get("/{talk_id}/analyze")
async def analyze(talk_id: str):
    talk = get_talk_by_id(talk_id)
    if not talk:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Talk not found")
    insight = await analyze_talk(talk["title"], talk["description"])
    return {"talk_id": talk_id, "insight": insight}
