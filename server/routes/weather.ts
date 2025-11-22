import type { RequestHandler } from "express";

const UA = "AgriSure/1.0 (+https://agrisure.app)";

export const handleWeather: RequestHandler = async (req, res) => {
  try {
    // Geocoding mode
    const search = (req.query.search as string) || "";
    if (search) {
      const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
      url.searchParams.set("name", search);
      url.searchParams.set("count", (req.query.count as string) || "10");
      const r = await fetch(url.toString(), { headers: { "user-agent": UA } });
      const j = await r.json();
      return res.json(j);
    }

    // Forecast mode
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    const allow = [
      "latitude",
      "longitude",
      "hourly",
      "daily",
      "current",
      "current_weather",
      "timezone",
      "start_date",
      "end_date",
    ];
    for (const k of allow) {
      const v = req.query[k as keyof typeof req.query];
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

    const r = await fetch(url.toString(), { headers: { "user-agent": UA } });
    const j = await r.json();
    res.json(j);
  } catch (e: any) {
    res
      .status(500)
      .json({ error: "weather_proxy_failed", detail: String(e?.message || e) });
  }
};
