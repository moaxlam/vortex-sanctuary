import type { RequestHandler } from "express";

const UA = "AgriSure/1.0 (+https://agrisure.app)";

export const handleClimate: RequestHandler = async (req, res) => {
  try {
    const url = new URL("https://climate-api.open-meteo.com/v1/climate");
    const forward: Record<string, string | string[] | undefined> =
      req.query as any;
    for (const [k, v] of Object.entries(forward)) {
      if (typeof v === "string") url.searchParams.set(k, v);
    }
    if (
      !url.searchParams.has("latitude") ||
      !url.searchParams.has("longitude")
    ) {
      return res
        .status(400)
        .json({ error: "latitude and longitude are required" });
    }
    if (!url.searchParams.has("models")) url.searchParams.set("models", "ERA5");
    if (!url.searchParams.has("monthly") && !url.searchParams.has("daily"))
      url.searchParams.set("monthly", "temperature_2m_mean,precipitation_sum");

    const r = await fetch(url.toString(), { headers: { "user-agent": UA } });
    const j = await r.json();
    return res.json(j);
  } catch (e: any) {
    res
      .status(500)
      .json({ error: "climate_proxy_failed", detail: String(e?.message || e) });
  }
};
