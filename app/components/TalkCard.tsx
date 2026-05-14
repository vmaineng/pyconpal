"use cilent";

import { useState } from "react";
import { Talk } from "../types";
import {
  Clock,
  MapPin,
  User,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Tag,
} from "lucide-react";

const TRACK_COLORS: Record<string, string> = {
  "AI/ML": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Web: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Core Python": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Data Science": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Security: "bg-red-500/20 text-red-300 border-red-500/30",
  "Open Source": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Tools: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Keynote: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

const DIFF_COLORS: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-300 border-red-500/30",
  All_levels: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

interface TalkCardProps {
  talk: Talk;
  userId: string;
  saved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}

export default function TalkCard({
  talk,
  userId,
  saved = false,
  onSaveChange,
}: TalkCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const trackColor =
    TRACK_COLORS[talk.track] ||
    "bg-gray-500/20 text-gray-300 border-gray-500/30";
  const diffColor =
    DIFF_COLORS[talk.difficulty] ||
    "bg-gray-500/20 text-gray-300 border-gray-500/30";

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    if (next) {
      await addToAgenda(userId, talk.id);
    } else {
      await removeFromAgenda(userId, talk.id);
    }
    onSaveChange?.(next);
  };

  const handleInsight = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (insight || loadingInsight) return;
    setLoadingInsight(true);
    try {
      const text = await fetchTalkInsight(talk.id);
      setInsight(text);
    } catch (error) {
      console.error("Error fetching talk insight:", error);
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-[15px] leading-snug group-hover:text-[#a89cf7 transition-colors line-clamp-2">
            {talk.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-white/50">
            <User size={12} />
            <span>{talk.speaker}</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`shrink-0 p-1.5 rounded-lg transition-all ${
            isSaved
              ? "text-[#7c6af7] bg-[#7c6af7]/10"
              : "text-white/30 hover:text-white/60"
          }`}
          title={isSaved ? "Remove from agenda" : "Save to agenda"}
        >
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${trackColor}`}
        >
          {talk.track}
        </span>
        <span className={`text-[11px] font-medium ${diffColor}`}>
          {talk.difficulty}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-white/40">
          <Clock size={10} /> {talk.time}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-white/40">
          <MapPin size={10} /> {talk.room}
        </span>
      </div>
      {expanded && (
        <div className="mt-3 space-y-3 border-t border-white/8 pt-3 animate-in fade-in duration-200">
          <p className="text-[13px] text-white/60 leading-relaxed">
            {talk.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {talk.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleInsight}
            disabled={loadingInsight}
            className="flex items-center gap-1.5 text-[12px] text-[#7c6af7] hover:text-[#a89cf7] transition-colors disabled:opacity-50"
          >
            <Sparkles size={12} />
            {loadingInsight
              ? "Analyzing..."
              : insight
                ? "Hide AI insight"
                : "Get AI insight"}
          </button>

          {insight && (
            <div className="bg-[#7c6af7]/8 border border-[#7c6af7]/20 rounded-xl p-3 text-[13px] text-white/70 leading-relaxed">
              ✨ {insight}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
