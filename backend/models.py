from pydantic import BaseModel
from typing import Optional


class Talk(BaseModel):
    id: str
    title: str
    speaker: str
    track: str
    day: str
    time: str
    room: str
    duration_minutes: int
    description: str
    tags: list[str]
    difficulty: str


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    interests: Optional[str] = None
    include_schedule: bool = True


class ChatResponse(BaseModel):
    reply: str
    suggested_talks: Optional[list[Talk]] = None


class AgendaItem(BaseModel):
    talk_id: str
    user_id: str
    notes: Optional[str] = None


class DayPlanRequest(BaseModel):
    interests: str
    day: str = "Friday"
