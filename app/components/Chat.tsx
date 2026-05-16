"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { sendChat } from "../lib/api";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const STARTER_PROMPTS = [
  "I'm into AI and open source. What should I prioritize?",
  "I'm a finance-to-engineering career switcher. Any talks for me?",
  "Build me a Friday schedule for a mid-level Python developer.",
  "What are the best beginner-friendly sessions?",
];

interface ChatProps {
  userId: string;
  interests: string;
}

export default function Chat({ userId, interests }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your PyCon assistant. Ask me anything about the schedule, and I can also help you build a personalized agenda based on your interests and experience level. Here are some example questions to get you started:\n\n" +
        STARTER_PROMPTS.map((p) => `- ${p}`).join("\n"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await sendChat(newMessages, interests);
      setMessages([...newMessages, { role: "assistant", content: res.reply }]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                msg.role === "assistant"
                  ? "bg-[#7c6af7]/20 text-[#7c6af7]"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot size={14} />
              ) : (
                <User size={14} />
              )}
            </div>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-[#0f1117] border border-white/8 text-white/85"
                  : "bg-[#7c6af7] text-white"
              }`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose prose-invert prose-sm max-w-none 
  prose-p:my-2 prose-p:leading-relaxed
  prose-ul:my-2 prose-li:my-1
  prose-h1:text-base prose-h1:font-bold prose-h1:mt-4 prose-h1:mb-2 prose-h1:text-[#a89cf7]
  prose-h2:text-sm prose-h2:font-semibold prose-h2:mt-4 prose-h2:mb-2 prose-h2:text-[#a89cf7]
  prose-h3:text-sm prose-h3:font-medium prose-h3:mt-3 prose-h3:mb-1 prose-h3:text-white/70
  prose-strong:text-white prose-strong:font-semibold
  prose-hr:border-white/10 prose-hr:my-3
  prose-code:bg-white/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#a89cf7]"
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[#7c6af7]/20 flex items-center justify-center">
              <Bot size={14} className="text-[#7c6af7] animate-spin" />
            </div>
            <div className="bg-[#0f1117] border border-white/8 rounded-2xl px-4 py-3">
              <Loader2 size={16} className="text-white/50 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="text-sm text-white/50 hover:text-white/80 bg-white/5 px-3 py-1 rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div>
        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about talks, schedule, speakers..."
            className="flex-1 bg-transparent text-white/85 text-[14px] outline-none placeholder:text-white/25"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="text-[#7c6af7] hover:text-[#a89cf7] disabled:text-white/20 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
