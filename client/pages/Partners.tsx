import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const KEY = "agrisure_partner_leads";

export default function Partners() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...form, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list));
    toast({ title: "Thanks!", description: "We’ll contact you shortly." });
    setForm({ name: "", email: "", company: "" });
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Partners</h1>
      <p className="text-muted-foreground">
        We collaborate with insurers, lenders and ag‑techs.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <p className="font-semibold">Become a partner</p>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <input
              required
              placeholder="Name"
              className="w-full h-10 rounded-md border px-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full h-10 rounded-md border px-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Company"
              className="w-full h-10 rounded-md border px-3"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <Button type="submit" className="w-full h-10">
              Request contact
            </Button>
          </form>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="font-semibold">Our ecosystem</p>
          <div className="mt-4 grid grid-cols-3 gap-3 opacity-80">
            {[
              "AgriCorp",
              "FieldTrust",
              "GreenLife",
              "FarmTech",
              "Sunrise",
              "EcoFunds",
            ].map((p) => (
              <div
                key={p}
                className="h-12 rounded bg-muted/50 grid place-items-center text-xs font-semibold"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
