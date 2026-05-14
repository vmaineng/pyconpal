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
}
