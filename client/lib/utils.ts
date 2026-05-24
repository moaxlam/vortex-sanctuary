import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turn API error payloads into readable text (avoids "[object Object]"). */
export function formatApiError(body: unknown): string {
  if (body == null) return "Request failed";
  if (typeof body === "string") return body;
  if (typeof body !== "object") return String(body);

  const o = body as Record<string, unknown>;
  if (typeof o.message === "string") return o.message;
  if (typeof o.error === "string" && !o.detail) return o.error;
  if (typeof o.hint === "string" && typeof o.detail === "string") {
    return `${o.detail} ${o.hint}`;
  }
  if (typeof o.detail === "string") return o.detail;
  if (Array.isArray(o.detail)) {
    return o.detail
      .map((item) =>
        typeof item === "object" && item && "msg" in item
          ? String((item as { msg: unknown }).msg)
          : formatApiError(item),
      )
      .join("; ");
  }
  if (o.detail && typeof o.detail === "object") {
    return formatApiError(o.detail);
  }
  if (typeof o.error === "string") return o.error;
  try {
    return JSON.stringify(body);
  } catch {
    return "Request failed";
  }
}

export function formatCurrency(v: number, currency: string = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `${currency} ${v.toFixed(0)}`;
  }
}
