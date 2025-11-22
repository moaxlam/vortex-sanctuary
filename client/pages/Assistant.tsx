import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
}
const STORAGE_KEY = "agrisure_assistant_chat";

const sysPrompt = "Provide concise, friendly insurance guidance.";

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setMessages(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(u);
    } catch {}
  };

  const ensureRec = () => {
    if (recRef.current) return recRef.current;
    const AnyRec: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!AnyRec) return null;
    const rec = new AnyRec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const t = e.results?.[0]?.[0]?.transcript;
      if (t) setInput(t);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return rec;
  };

  const onVoice = () => {
    const rec = ensureRec();
    if (!rec) return alert("Voice not supported on this browser");
    if (!listening) {
      setListening(true);
      rec.start();
    } else {
      setListening(false);
      rec.stop();
    }
  };

  const send = async () => {
    if (!input.trim()) return;
    const u: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
      ts: Date.now(),
    };
    setMessages((m) => [...m, u]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: u.text, system: sysPrompt }),
      });
      if (!r.ok) throw new Error("Network");
      const j = await r.json();
      const text: string = j?.text ?? "Sorry, I couldn't respond.";
      const a: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text,
        ts: Date.now(),
      };
      setMessages((m) => [...m, a]);
      speak(text);
    } catch (e) {
      const fallback =
        "Thanks! For quotes, tell me your crop, location and coverage. I’ll compare options and guide you.";
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: fallback,
          ts: Date.now(),
        },
      ]);
      speak(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Assistant</h1>
      <p className="text-muted-foreground">
        Ask insurance questions. I’ll keep it short and helpful.
      </p>

      <div className="mt-6 rounded-xl border bg-card">
        <div ref={listRef} className="h-[50vh] overflow-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Tip: Try “What cover is best for wheat in heavy rain?”
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 p-3 border-t">
          <button
            onClick={onVoice}
            className={`h-10 w-10 rounded-md border grid place-items-center ${listening ? "bg-emerald-50 border-emerald-200 text-emerald-700" : ""}`}
            title="Voice input"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 h-10 rounded-md border px-3"
            placeholder="Ask about crop, claims, premiums…"
          />
          <Button onClick={send} disabled={loading} className="h-10">
            {loading ? "Thinking…" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
