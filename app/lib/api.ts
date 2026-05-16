import { use } from "react";
import {Talk, ChatMessage, ChatResponse} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendChat(
    messages: ChatMessage[],
    interests?: string) :Promise<ChatResponse> {
    const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages, interests, include_schedule: true }),
    });
    if (!res.ok) throw new Error("Chat request failed");
    return res.json();
}

export async function fetchTalks(params?: { 
    day?: string;
    track?: string;
    q?: string;
}) : Promise<Talk[]> {
    const query = new URLSearchParams();
    if (params?.day) query.set("day", params.day);
    if (params?.track) query.set("track", params.track);
    if (params?.q) query.set("q", params.q);
    const res = await fetch(`${API_URL}/api/schedule/?${query}`);
    if (!res.ok) throw new Error("Failed to fetch talks");
    return res.json();
}

export async function fetchTalkInsight(talkId: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/schedule/${talkId}/analyze`);
  if (!res.ok) throw new Error("Failed to analyze talk");
  const data = await res.json();
  return data.insight;
}

export async function fetchAgenda(userId: string) : Promise<Talk[]> {
    const res = await fetch(`${API_URL}/api/agenda/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch agenda");
    return res.json();
}

export async function addToAgenda(userId: string, talkId: string):Promise<void> {
    const res = await fetch(`${API_URL}/api/agenda/${userId}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, talk_Id: talkId }),
    });
    if (!res.ok) throw new Error("Failed to add to agenda");
}

export async function removeFromAgenda(
  userId: string,
  talkId: string
): Promise<void> {
  await fetch(`${API_URL}/api/agenda/${userId}/${talkId}`, {
    method: "DELETE",
  });
}
export async function generateDayPlan(
    interests: string,
    day: string): Promise<string> {
    const res = await fetch(`${API_URL}/api/chat/day-plan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests, day }),
    });
    if (!res.ok) throw new Error("Failed to generate day plan");
    const data = await res.json();
    return data.plan;
}
