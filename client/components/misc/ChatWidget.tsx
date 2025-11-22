import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  role: "user" | "bot";
  text: string;
  ts: number;
}
const STORAGE_KEY = "agrisure_widget_chat";

const scripts = [
  {
    match: /claim|file/i,
    reply:
      "To file a claim, go to Assistant or call our 24/7 line. We guide you step by step.",
  },
  {
    match: /weather|rain|forecast/i,
    reply:
      "Check the Weather page for real-time and 6‑month outlook. It auto-detects your location.",
  },
  {
    match: /premium|price|cost/i,
    reply:
      "Premiums depend on crop, location and coverage. Try our Assistant for a quick personalized quote.",
  },
  {
    match: /hello|hi|hey/i,
    reply:
      "Hi! I’m Agri the helper. Ask me about insurance, weather or claims.",
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setMessages(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const onSend = () => {
    if (!input.trim()) return;
    const user: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
      ts: Date.now(),
    };
    const botText =
      scripts.find((s) => s.match.test(input))?.reply ??
      "I can help with insurance basics, weather insights and claims. Try the Assistant for deeper guidance.";
    const bot: Msg = {
      id: crypto.randomUUID(),
      role: "bot",
      text: botText,
      ts: Date.now() + 1,
    };
    setMessages((m) => [...m, user, bot]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-[320px] sm:w-[360px] rounded-xl border bg-background shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <p className="font-semibold">Ask Agri</p>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <div ref={listRef} className="max-h-72 overflow-auto p-3 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "text-sm",
                  m.role === "user" ? "text-right" : "text-left",
                )}
              >
                <span
                  className={cn(
                    "inline-block px-3 py-2 rounded-lg",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Hi! I’m a quick helper. Ask about weather, claims or premiums.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 p-3 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="Type a message"
              className="flex-1 h-10 rounded-md border bg-background px-3"
            />
            <Button onClick={onSend} className="h-10">
              Send
            </Button>
          </div>
        </div>
      )}
      <Button
        size="lg"
        className="shadow-lg"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide chat" : "Chat"}
      </Button>
    </div>
  );
}
