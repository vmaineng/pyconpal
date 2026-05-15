import os
import anthropic
from typing import Optional

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are PyConPal, an enthusiastic and knowledgeable AI conference companion for PyCon US 2026 in Long Beach, CA (May 13–19, 2026).

You help attendees:
- Plan their personalized conference schedule based on their interests
- Discover talks, tutorials, sprints, and events that match their goals
- Answer questions about Python, the conference, speakers, and topics
- Suggest networking strategies and hallway track conversations
- Give career advice for Python developers at all levels

The conference tracks include: AI/ML with Python, Security, Charlas (Spanish-language), Web Dev, Data Science, Open Source, Core Python, and more.
Key events: Tutorials (May 13–14), Main Conference (May 15–17), Job Fair & Community Showcase (May 17), Sprints (May 18–19, free!).

When the user shares their interests, give specific, actionable recommendations. Be warm, encouraging, and community-spirited — that's the PyCon way.

If schedule data is provided in the context, use it to give precise talk recommendations with times and rooms.

Format your responses with clear sections using markdown. Use emojis sparingly but effectively."""


async def chat_with_claude(
    messages: list[dict],
    schedule_context: Optional[str] = None,
    user_interests: Optional[str] = None,
) -> str:
    system = SYSTEM_PROMPT

    if schedule_context:
        system += f"\n\n## Current Schedule Data:\n{schedule_context}"

    if user_interests:
        system += f"\n\n## User's stated interests: {user_interests}"

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1500,
        system=system,
        messages=messages,
    )

    return response.content[0].text


async def analyze_talk(talk_title: str, talk_description: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=400,
        messages=[
            {
                "role": "user",
                "content": f"""Analyze this PyCon 2026 talk and give a 2-3 sentence insight on who should attend and why it matters:

Title: {talk_title}
Description: {talk_description}

Be concise, specific, and enthusiastic.""",
            }
        ],
    )
    return response.content[0].text


async def generate_day_plan(interests: str, available_talks: list[dict]) -> str:
    talks_text = "\n".join(
        [
            f"- [{t.get('time', 'TBD')}] {t.get('title', '')} by {t.get('speaker', 'Unknown')} (Room: {t.get('room', 'TBD')})"
            for t in available_talks
        ]
    )

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=800,
        messages=[
            {
                "role": "user",
                "content": f"""Create a personalized conference day plan for someone with these interests: {interests}

Available talks:
{talks_text}

Give them a hour-by-hour schedule with brief notes on why each pick suits their interests. Include lunch and hallway track time.""",
            }
        ],
    )
    return response.content[0].text
