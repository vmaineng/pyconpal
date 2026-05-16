from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, schedule, agenda

app = FastAPI(title="PyConPal API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app", "https://pyconpal-p1kof8vd4-vmainengs-projects.vercel.app", "https://pyconpal.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(schedule.router, prefix="/api/schedule", tags=["schedule"])
app.include_router(agenda.router, prefix="/api/agenda", tags=["agenda"])


@app.get("/")
def root():
    return {"status": "PyConPal API is running 🐍"}
