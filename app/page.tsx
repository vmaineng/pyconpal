"use client";

import { useState } from "react";
import Chat from "./components/Chat";
import Schedule from "./components/Schedule";
import Agenda from "./components/Agenda";
import { MessageSquare, CalendarDays, List, Zap } from "lucide-react";

type Tab = "chat" | "schedule" | "agenda";

const USER_ID = "demo-user";

export default function Home() {
  const [tab, setTab] = useState<Tab>("chat");
  const [interests, setInterests] = useState("");

  const TABS = [
    { id: "chat" as Tab, label: "AI Chat", icon: MessageSquare },
    { id: "schedule" as Tab, label: "Schedule", icon: List },
    { id: "agenda" as Tab, label: "My Agenda", icon: CalendarDays },
  ];

  return (
    <div
      className="min-h-screen bg-[#080b12] text-white font-sans flex flex-col"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <header className="border-b border-white/8 bg-[#080b12]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#7c6af7] flex items-center justify-center text-[16px]">
              🐍
            </div>
            <div>
              <span className="font-bold text-white text-[15px] tracking-tight">
                PyConPal
              </span>
              <span className="text-[10px] text-white/30 ml-2">
                Long Beach 2026
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live · May 15–17
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar — interests setup */}
        <aside className="lg:w-64 shrink-0 space-y-4">
          <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[#7c6af7]" />
              <span className="text-[13px] font-semibold text-white/80">
                Your Interests
              </span>
            </div>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. AI, open source, career switching, data science..."
              className="w-full bg-[#080b12] border border-white/8 rounded-xl px-3 py-2.5 text-[13px] text-white/70 placeholder:text-white/25 outline-none focus:border-[#7c6af7]/40 resize-none transition-colors"
              rows={3}
            />
            <p className="text-[11px] text-white/30 mt-2">
              Used to personalize your AI recommendations
            </p>
          </div>

          {/* Conference info */}
          <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-4 space-y-3">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Quick Info
            </p>
            {[
              { label: "Tutorials", value: "May 13–14" },
              { label: "Main Conf", value: "May 15–17" },
              { label: "Job Fair", value: "May 17" },
              { label: "Sprints", value: "May 18–19 · Free!" },
              { label: "Venue", value: "Long Beach, CA" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-[12px]">
                <span className="text-white/40">{label}</span>
                <span className="text-white/70 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <nav className="hidden lg:flex flex-col gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                  tab === id
                    ? "bg-[#7c6af7]/15 text-[#a89cf7] border border-[#7c6af7]/25"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 bg-[#0f1117] border border-white/8 rounded-2xl overflow-hidden flex flex-col min-h-[600px]">
          {tab === "chat" && <Chat userId={USER_ID} interests={interests} />}
          {tab === "schedule" && <Schedule userId={USER_ID} />}
          {tab === "agenda" && <Agenda userId={USER_ID} />}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#080b12]/90 backdrop-blur-md border-t border-white/8 flex">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] transition-colors ${
              tab === id ? "text-[#7c6af7]" : "text-white/30"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
