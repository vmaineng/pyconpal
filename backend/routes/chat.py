from fastapi import APIRouter
from models import ChatRequest, ChatResponse, DayPlanRequest
from services.llm import chat_with_claude, generate_day_plan
from services.parser import get_all_talks, format_schedule_for_llm, search_talks

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    schedule_context = None
    suggested_talks = None

    if request.include_schedule:
        all_talks = get_all_talks()
        schedule_context = format_schedule_for_llm(all_talks)

        # If user has interests, pre-filter relevant talks
        if request.interests:
            suggested_talks = search_talks(request.interests)[:4]

    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    reply = await chat_with_claude(
        messages=messages,
        schedule_context=schedule_context,
        user_interests=request.interests,
    )

    return ChatResponse(reply=reply, suggested_talks=suggested_talks)


@router.post("/day-plan")
async def generate_plan(request: DayPlanRequest):
    from services.parser import get_talks_by_day

    talks = get_talks_by_day(request.day)
    plan = await generate_day_plan(request.interests, talks)
    return {"plan": plan, "day": request.day}
