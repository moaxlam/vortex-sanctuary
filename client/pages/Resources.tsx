import { useMemo, useState } from "react";

const ARTICLES = [
  { id: 1, title: "Choosing crop insurance in monsoon regions", tag: "Crop" },
  {
    id: 2,
    title: "Livestock health checklist for heat waves",
    tag: "Livestock",
  },
  { id: 3, title: "Understanding weather indices for payouts", tag: "Weather" },
  { id: 4, title: "What affects your premium?", tag: "Pricing" },
  { id: 5, title: "Motor cover for farm vehicles: basics", tag: "Motor" },
];

export default function Resources() {
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      ARTICLES.filter((a) => a.title.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Resources</h1>
      <p className="text-muted-foreground">
        Guides and insights to help you decide.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles"
          className="h-10 w-full max-w-md rounded-md border px-3"
        />
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {list.map((a) => (
          <article key={a.id} className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">{a.tag}</p>
            <h3 className="font-semibold">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Actionable tips and checklists for farmers. Ask the Assistant to
              summarize for your location.
            </p>
            <a
              className="mt-3 inline-block text-sm text-primary underline"
              href="/assistant"
            >
              Read with Assistant
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
