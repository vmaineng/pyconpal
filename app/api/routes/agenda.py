from fastapi import APIRouter
from models import AgendaItem
from services.parser import get_talk_by_id

router = APIRouter()

# In-memory store (swap for Supabase in production)
_agenda: dict[str, list[dict]] = {}


@router.get("/{user_id}")
def get_agenda(user_id: str):
    items = _agenda.get(user_id, [])
    enriched = []
    for item in items:
        talk = get_talk_by_id(item["talk_id"])
        if talk:
            enriched.append({**talk, "notes": item.get("notes")})
    return enriched


@router.post("/{user_id}")
def add_to_agenda(user_id: str, item: AgendaItem):
    if user_id not in _agenda:
        _agenda[user_id] = []

    # Avoid duplicates
    existing_ids = [i["talk_id"] for i in _agenda[user_id]]
    if item.talk_id not in existing_ids:
        _agenda[user_id].append({"talk_id": item.talk_id, "notes": item.notes})

    return {"success": True, "message": "Talk added to agenda"}


@router.delete("/{user_id}/{talk_id}")
def remove_from_agenda(user_id: str, talk_id: str):
    if user_id in _agenda:
        _agenda[user_id] = [i for i in _agenda[user_id] if i["talk_id"] != talk_id]
    return {"success": True, "message": "Talk removed from agenda"}


@router.get("/{user_id}/check/{talk_id}")
def check_in_agenda(user_id: str, talk_id: str):
    items = _agenda.get(user_id, [])
    return {"saved": any(i["talk_id"] == talk_id for i in items)}
