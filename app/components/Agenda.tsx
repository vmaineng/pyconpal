"use client";

import { useState, useEffect } from "react";
import { fetchAgenda } from "../lib/api";
import TalkCard from "./TalkCard";
import { Talk } from "../types";
import { CalendarDays, Inbox } from "lucide-react";

interface AgendaProps {
  userId: string;
}

export default function Agenda({ userId }: AgendaProps) {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAgenda(userId);
        setTalks(data);
      } catch (error) {
        setError("Failed to fetch agenda");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const byDay = talks.reduce<Record<string, Talk[]>>((acc, talk) => {
    if (!acc[talk.day]) acc[talk.day] = [];
    acc[talk.day].push(talk);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/50">
        <CalendarDays size={48} className="mb-4 animate-pulse" />
        Loading your agenda...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <Inbox size={48} className="mb-4" />
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/8 flex items-center gap-2">
        <CalendarDays size={20} className="text-white/50" />
        <span className="text-[13px] text-white/70 font-medium">My Agenda</span>
        <span className="ml-auto text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
          {talks.length} saved
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-white/30 text-sm">
            Loading...
          </div>
        ) : talks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-white/25 gap-3">
            <Inbox size={32} />
            <div className="text-center">
              <p className="text-sm font-medium text-white/40">
                No talks saved yet
              </p>
              <p className="text-xs mt-1">
                Browse the schedule and tap 🔖 to save talks
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {["Friday", "Saturday", "Sunday"].map((day) =>
              byDay[day] ? (
                <div key={day}>
                  <h3 className="text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-3">
                    {day} · {byDay[day].length} talks
                  </h3>
                  <div className="space-y-3">
                    {byDay[day]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((talk) => (
                        <TalkCard
                          key={talk.id}
                          talk={talk}
                          userId={userId}
                          saved={true}
                          onSaveChange={(saved) => {
                            if (!saved) {
                              setTalks((prev) =>
                                prev.filter((t) => t.id !== talk.id),
                              );
                            }
                          }}
                        />
                      ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}
