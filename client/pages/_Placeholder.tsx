export default function Placeholder({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-2 text-muted-foreground max-w-prose">
        {children ?? (
          <p>
            This page is a placeholder. Tell me what content and design you want
            here and I’ll build it. Meanwhile, use the Assistant for quick
            guidance.
          </p>
        )}
      </div>
      <div className="mt-6 flex gap-3">
        <a
          href="/assistant"
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-primary-foreground"
        >
          Open Assistant
        </a>
        <a
          href="/weather"
          className="inline-flex h-10 items-center rounded-md border px-4"
        >
          View Weather
        </a>
      </div>
    </div>
  );
}
