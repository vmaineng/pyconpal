"use client";

import { useState, useEffect, use } from "react";
import { Talk } from "../types";
import { fetchTalks } from "../lib/api";
import TalkCard from "./TalkCard";
import { Search, Filter } from "lucide-react";

const days = ["All", "Friday", "Saturday", "Sunday"];
const tracks = [
  "All",
  "AI/ML",
  "Web",
  "Core Python",
  "Data Science",
  "Security",
  "Open Source",
  "Tools",
  "Keynote",
];

interface ScheduleProps {
  userId: string;
}

export default function Schedule({ userId }: ScheduleProps) {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState("All");
  const [trackFilter, setTrackFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (dayFilter !== "All") params.day = dayFilter;
        if (trackFilter !== "All") params.track = trackFilter;
        if (searchQuery) params.q = searchQuery;
        const data = await fetchTalks(params);
        setTalks(data);
      } catch (error) {
        setError("Failed to fetch talks");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(load, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [dayFilter, trackFilter, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-3 border-b border-white/8">
        <div className="flex gap-2 bg-[#0f1117] border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#7c6af7]/40 transition-colors">
          <Search size={14} className="text-white/50 shrink-0 mt-0.5" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search talks..."
            className="flex-1 bg-transparent text-white/85 text-[13px] outline-none placeholder:text-white/25"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setDayFilter(day)}
              className={`shrink-0 text-[12px] px-3 py-1 rounded-full transition-all ${
                day === dayFilter
                  ? "bg-[#7c6af7] text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setTrackFilter(track)}
              className={`shrink-0 text-[12px] px-3 py-1 rounded-full transition-all ${
                track === trackFilter
                  ? "bg-[#7c6af7] text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-white/30 text-sm">
            Loading talks...
          </div>
        ) : talks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-white/30 text-sm gap-2">
            <Filter size={20} />
            No talks match your filters
          </div>
        ) : (
          <>
            <p className="text-[11px] text-white/30">{talks.length} talks</p>
            {talks.map((talk) => (
              <TalkCard key={talk.id} talk={talk} userId={userId} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
