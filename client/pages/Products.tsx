import { Button } from "@/components/ui/button";
import { ShieldCheck, Leaf, Truck, Users, Heart } from "lucide-react";

export default function Products() {
  const products = [
    {
      key: "crop",
      title: "Crop",
      icon: <Leaf className="h-5 w-5" />,
      bullets: [
        "Yield loss protection",
        "Weather-index index cover",
        "Localized pricing",
      ],
      cta: "Get crop quote",
    },
    {
      key: "health",
      title: "Health",
      icon: <Heart className="h-5 w-5" />,
      bullets: ["Family coverage", "Cashless hospital network", "Telemedicine"],
      cta: "Explore health",
    },
    {
      key: "livestock",
      title: "Livestock",
      icon: <Users className="h-5 w-5" />,
      bullets: ["Cattle & poultry", "Vet support", "Theft & mortality"],
      cta: "Cover livestock",
    },
    {
      key: "motor",
      title: "Motor",
      icon: <Truck className="h-5 w-5" />,
      bullets: [
        "Tractors & two‑wheelers",
        "Third‑party & own‑damage",
        "Fast claims",
      ],
      cta: "Insure vehicle",
    },
  ];

  const tiers = [
    {
      name: "Basic",
      price: "Low",
      features: ["Essential perils", "Standard deductibles", "Email support"],
    },
    {
      name: "Standard",
      price: "Medium",
      features: ["Wider perils", "Lower deductibles", "Priority support"],
    },
    {
      name: "Comprehensive",
      price: "High",
      features: [
        "All‑risk incl. riders",
        "Lowest deductibles",
        "24/7 phone support",
      ],
    },
  ];

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="text-muted-foreground">
        Insurance built for agriculture — flexible coverage with transparent
        pricing.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <article key={p.key} className="rounded-xl border bg-card p-5">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              {p.icon}
            </div>
            <h3 className="mt-3 font-semibold">{p.title}</h3>
            <ul className="mt-2 text-sm text-muted-foreground list-disc pl-4 space-y-1">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Button asChild className="mt-4 w-full">
              <a href={`/quote?product=${p.key}`}>{p.cta}</a>
            </Button>
          </article>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Compare tiers</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-xl border bg-card p-6">
              <p className="text-sm text-muted-foreground">{t.price} premium</p>
              <p className="text-lg font-semibold">{t.name}</p>
              <ul className="mt-3 text-sm list-disc pl-4 space-y-1">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button asChild className="mt-4 w-full">
                <a href={`/quote?tier=${encodeURIComponent(t.name)}`}>
                  Select {t.name}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border bg-gradient-to-br from-emerald-50 to-amber-50 p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Claims you can rely on</p>
            <p className="text-sm text-muted-foreground">
              Upload photos, get farm‑gate assessment and track settlement
              online.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
