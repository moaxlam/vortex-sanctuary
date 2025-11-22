export default function About() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">About AgriSure</h1>
      <p className="text-muted-foreground max-w-prose">
        AgriSure protects farmers with modern insurance, weather intelligence
        and human support. We partner with trusted insurers and local networks
        to make cover simple and reliable.
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Founded</p>
          <p className="text-2xl font-extrabold">2025</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Coverage</p>
          <p className="text-2xl font-extrabold">120k+ farmers</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Satisfaction</p>
          <p className="text-2xl font-extrabold">92%</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Our values</h2>
        <ul className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
          <li className="rounded-xl border bg-card p-5">Trust first</li>
          <li className="rounded-xl border bg-card p-5">Farm‑gate service</li>
          <li className="rounded-xl border bg-card p-5">
            Data‑driven fairness
          </li>
        </ul>
      </section>
    </div>
  );
}
