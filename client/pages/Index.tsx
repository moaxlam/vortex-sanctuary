import { WeatherWidget } from "@/components/ui/WeatherWidget";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Heart,
  Users,
  Truck,
  Leaf,
  ArrowRight,
} from "lucide-react";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="container py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Trusted insurance for farmers
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Protect your farm with AgriSure
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              Crop, livestock, health and motor insurance built for agriculture.
              Real‑time weather insights and AI guidance help you decide faster.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2" asChild>
                <a href="/assistant">
                  Talk to Assistant <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/weather">View Weather Analytics</a>
              </Button>
            </div>
            <div className="mt-10 max-w-md">
              <WeatherWidget />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="relative rounded-2xl border bg-card p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <MiniCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Guaranteed"
                  subtitle="Claim support 24/7"
                />
                <MiniCard
                  icon={<Leaf className="h-5 w-5" />}
                  title="Sustainable"
                  subtitle="Climate-smart"
                />
                <MiniCard
                  icon={<Heart className="h-5 w-5" />}
                  title="Health"
                  subtitle="Family coverage"
                />
                <MiniCard
                  icon={<Truck className="h-5 w-5" />}
                  title="Assets"
                  subtitle="Tractors & tools"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="container py-10 md:py-14">
        <p className="text-center text-sm text-muted-foreground">
          Backed by partners
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-6 items-center opacity-70">
          {["AgriCorp", "FieldTrust", "GreenLife", "FarmTech", "Sunrise"].map(
            (p) => (
              <div
                key={p}
                className="h-10 rounded bg-muted/40 flex items-center justify-center text-xs font-semibold"
              >
                {p}
              </div>
            ),
          )}
        </div>
      </section>

      {/* Products */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-2xl md:text-3xl font-bold">Insurance products</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProductCard
              title="Crop"
              desc="Yield & weather-indexed cover for major crops."
              icon={<Leaf className="h-5 w-5" />}
            />
            <ProductCard
              title="Health"
              desc="Affordable family plans with rural networks."
              icon={<Heart className="h-5 w-5" />}
            />
            <ProductCard
              title="Livestock"
              desc="Cattle, poultry and aquaculture protection."
              icon={<Users className="h-5 w-5" />}
            />
            <ProductCard
              title="Motor"
              desc="Tractors, two‑wheelers and farm vehicles."
              icon={<Truck className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {[
            { t: "Tell us your needs", s: "Crop, location and budget" },
            { t: "Get instant quote", s: "AI compares coverage" },
            { t: "Buy securely", s: "Digital KYC & payment" },
            { t: "Get support", s: "Claims and renewals 24/7" },
          ].map((it, i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary grid place-items-center font-bold">
                {i + 1}
              </div>
              <p className="mt-3 font-semibold">{it.t}</p>
              <p className="text-sm text-muted-foreground">{it.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact metrics */}
      <section className="border-y bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="container py-16 grid sm:grid-cols-3 gap-6">
          <Metric n="120k+" l="Farmers covered" />
          <Metric n="3.2M" l="Livestock protected" />
          <Metric n="92%" l="Claim satisfaction" />
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <h3 className="text-2xl md:text-3xl font-bold">
          Ready to secure your season?
        </h3>
        <p className="mt-2 text-muted-foreground">
          Get a quote in minutes or chat with our assistant.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button size="lg" asChild>
            <a href="/assistant">Get guidance</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/weather">See weather</a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ProductCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 hover:shadow-sm transition">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function MiniCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-2 font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Metric({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center">
      <p className="text-3xl font-extrabold tracking-tight">{n}</p>
      <p className="text-sm text-muted-foreground">{l}</p>
    </div>
  );
}
