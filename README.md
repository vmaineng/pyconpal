# PyConPal 🐍

An AI-powered conference companion for PyCon 2026. Ask it anything about 
the schedule — it builds personalized agendas based on your interests, 
experience level, and availability.

**Live:** https://pyconpal.vercel.app

---

## Why I built this

PyCon runs 100+ talks across simultaneous tracks. First-timers and 
career-switchers have no good way to filter by what's actually relevant 
to them. I wanted a tool that understood *context* — not just keywords.

---

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | Next.js + TypeScript | App Router for layout, fast page loads |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Backend | FastAPI (Python) | Lightweight, async, easy Claude API integration |
| Database | Supabase (PostgreSQL) | Schedule data storage + cache layer |
| AI | Anthropic Claude API | Conversational agenda building |
| Deploy | Vercel (FE) + Render (BE) | Free tier, easy CI/CD |

---

## Architecture
User → Next.js frontend → FastAPI backend → Claude API
↓
Supabase (schedule data)
cache-hit: return stored data
cache-miss: fetch, store, return

The key design decision was keeping the Claude API call server-side 
(FastAPI) rather than client-side. This keeps the API key secure and 
lets me inject structured schedule data into the prompt context before 
it hits the model — so responses are grounded in real session data, 
not hallucinated.

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/vmaineng/pyconpal.git

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env  # add your keys
uvicorn main:app --reload

# Frontend
cd frontend
npm install
cp .env.example .env.local  # add your API URL
npm run dev
```

**Required env vars:**
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=

---

## Features

- AI chat grounded in real PyCon 2026 schedule data
- Personalized agenda building by interest + experience level
- Example prompts to reduce blank-input drop-off
- Schedule browsing by day and track
- My Agenda tab for session bookmarking

---

## What I'd Improve

- **No auth yet** — agendas are session-based and don't persist on 
  refresh. Supabase Auth is already in the stack; this would be the 
  next PR.
- **Schedule ingestion is manual** — I'd automate the Supabase sync 
  with a cron job tied to the official PyCon API or schedule feed.
- **Mobile layout** — works, but wasn't the primary design target. 
  Would tighten the chat UI on smaller screens.

---

## What I learned

Grounding LLM responses in structured data is harder than it looks. 
The first version let Claude answer freely — it confidently hallucinated 
session times. The cache-hit/miss architecture was the fix, and it's 
now the pattern I reach for on any AI project with domain-specific data.

---

## Author

Mai Vang · [Portfolio](https://pastel-portfolio-iota.vercel.app) · 
[LinkedIn](https://linkedin.com/in/mai-vang-swe) · 
[GitHub](https://github.com/vmaineng)
