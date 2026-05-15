import json
from typing import Optional
from models import Talk


# Seeded PyCon 2026 talks — in production, scrape us.pycon.org/2026/schedule/
SEED_TALKS = [
    {
        "id": "1",
        "title": "Building Production-Ready AI Agents with Python",
        "speaker": "Łukasz Langa",
        "track": "AI/ML",
        "day": "Friday",
        "time": "10:00 AM",
        "room": "Hall B",
        "duration_minutes": 45,
        "description": "A deep dive into architecting reliable AI agent systems using Python, covering tool use, memory patterns, and failure modes in production.",
        "tags": ["ai", "agents", "llm", "production"],
        "difficulty": "intermediate",
    },
    {
        "id": "2",
        "title": "FastAPI in the Wild: Lessons from Scale",
        "speaker": "Sebastián Ramírez",
        "track": "Web",
        "day": "Friday",
        "time": "11:30 AM",
        "room": "Hall A",
        "duration_minutes": 45,
        "description": "Real-world patterns, anti-patterns, and performance wins from running FastAPI at scale across diverse production systems.",
        "tags": ["fastapi", "web", "api", "performance"],
        "difficulty": "intermediate",
    },
    {
        "id": "3",
        "title": "Python Type System Deep Dive",
        "speaker": "Guido van Rossum",
        "track": "Core Python",
        "day": "Saturday",
        "time": "9:00 AM",
        "room": "Ballroom",
        "duration_minutes": 60,
        "description": "An authoritative look at Python's evolving type system, from PEP 484 to modern patterns and what's coming next.",
        "tags": ["types", "mypy", "python", "core"],
        "difficulty": "advanced",
    },
    {
        "id": "4",
        "title": "Open Source Contribution: From Zero to Merged",
        "speaker": "Mariatta Wijaya",
        "track": "Open Source",
        "day": "Saturday",
        "time": "1:00 PM",
        "room": "Room 201",
        "duration_minutes": 30,
        "description": "A practical guide to making your first open source contribution, navigating maintainer relationships, and building a sustainable contribution practice.",
        "tags": ["open-source", "community", "beginner", "git"],
        "difficulty": "beginner",
    },
    {
        "id": "5",
        "title": "Pandas 3.0: What Changed and Why It Matters",
        "speaker": "Marco Gorelli",
        "track": "Data Science",
        "day": "Friday",
        "time": "2:00 PM",
        "room": "Hall C",
        "duration_minutes": 45,
        "description": "Breaking down the major changes in pandas 3.0, migration strategies, and how the new copy-on-write semantics transform data workflows.",
        "tags": ["pandas", "data", "migration", "performance"],
        "difficulty": "intermediate",
    },
    {
        "id": "6",
        "title": "Securing Python Applications in 2026",
        "speaker": "Seth Larson",
        "track": "Security",
        "day": "Saturday",
        "time": "3:30 PM",
        "room": "Hall B",
        "duration_minutes": 45,
        "description": "Current threat landscape for Python apps, supply chain security, SBOM generation, and practical hardening techniques.",
        "tags": ["security", "supply-chain", "sbom", "python"],
        "difficulty": "intermediate",
    },
    {
        "id": "7",
        "title": "Building CLI Tools That People Actually Use",
        "speaker": "Hynek Schlawack",
        "track": "Tools",
        "day": "Friday",
        "time": "3:45 PM",
        "room": "Room 104",
        "duration_minutes": 30,
        "description": "UX principles for command-line tools, using Click and Typer effectively, and making CLIs that your users will love.",
        "tags": ["cli", "click", "typer", "ux"],
        "difficulty": "beginner",
    },
    {
        "id": "8",
        "title": "Async Python Patterns for AI Workloads",
        "speaker": "Andrew Godwin",
        "track": "AI/ML",
        "day": "Saturday",
        "time": "11:00 AM",
        "room": "Hall A",
        "duration_minutes": 45,
        "description": "How to structure async Python for streaming LLM responses, parallel tool calls, and efficient queue management in AI applications.",
        "tags": ["async", "ai", "streaming", "concurrency"],
        "difficulty": "intermediate",
    },
    {
        "id": "9",
        "title": "Python for Finance: From Analyst to Engineer",
        "speaker": "Yves Hilpisch",
        "track": "Data Science",
        "day": "Saturday",
        "time": "2:30 PM",
        "room": "Room 202",
        "duration_minutes": 45,
        "description": "Bridging the gap between financial analysis and software engineering with Python — covering quant workflows, backtesting, and building production finance tools.",
        "tags": ["finance", "data", "quant", "career"],
        "difficulty": "intermediate",
    },
    {
        "id": "10",
        "title": "Keynote: The Future of Python",
        "speaker": "Python Steering Council",
        "track": "Keynote",
        "day": "Friday",
        "time": "9:00 AM",
        "room": "Main Ballroom",
        "duration_minutes": 60,
        "description": "The annual state of Python address — upcoming language features, ecosystem trends, and the community roadmap.",
        "tags": ["keynote", "python", "community", "roadmap"],
        "difficulty": "all",
    },
    {
        "id": "11",
        "title": "Testing AI: Evals, Red-Teaming, and Prompt Regression",
        "speaker": "Simon Willison",
        "track": "AI/ML",
        "day": "Sunday",
        "time": "10:00 AM",
        "room": "Hall B",
        "duration_minutes": 45,
        "description": "Practical strategies for testing LLM-powered applications — building eval suites, catching regressions, and red-teaming your own systems.",
        "tags": ["testing", "evals", "ai", "llm"],
        "difficulty": "intermediate",
    },
    {
        "id": "12",
        "title": "Pydantic V2: Validation at the Speed of Rust",
        "speaker": "Samuel Colvin",
        "track": "Core Python",
        "day": "Friday",
        "time": "1:00 PM",
        "room": "Room 103",
        "duration_minutes": 30,
        "description": "Deep dive into Pydantic V2's Rust core, performance benchmarks, migration from V1, and advanced validation patterns.",
        "tags": ["pydantic", "validation", "performance", "rust"],
        "difficulty": "intermediate",
    },
]


def get_all_talks() -> list[dict]:
    return SEED_TALKS


def get_talks_by_day(day: str) -> list[dict]:
    return [t for t in SEED_TALKS if t["day"].lower() == day.lower()]


def get_talks_by_track(track: str) -> list[dict]:
    return [t for t in SEED_TALKS if t["track"].lower() == track.lower()]


def get_talk_by_id(talk_id: str) -> Optional[dict]:
    for talk in SEED_TALKS:
        if talk["id"] == talk_id:
            return talk
    return None


def search_talks(query: str) -> list[dict]:
    query_lower = query.lower()
    results = []
    for talk in SEED_TALKS:
        if (
            query_lower in talk["title"].lower()
            or query_lower in talk["description"].lower()
            or query_lower in talk["speaker"].lower()
            or any(query_lower in tag for tag in talk["tags"])
            or query_lower in talk["track"].lower()
        ):
            results.append(talk)
    return results


def format_schedule_for_llm(talks: list[dict]) -> str:
    grouped: dict[str, list] = {}
    for talk in talks:
        day = talk.get("day", "Unknown")
        if day not in grouped:
            grouped[day] = []
        grouped[day].append(talk)

    lines = []
    for day, day_talks in grouped.items():
        lines.append(f"\n### {day}")
        for t in sorted(day_talks, key=lambda x: x.get("time", "")):
            lines.append(
                f"  [{t['time']}] **{t['title']}** — {t['speaker']} | {t['track']} | {t['room']} | {t['difficulty']}"
            )
            lines.append(f"  {t['description'][:120]}...")

    return "\n".join(lines)
