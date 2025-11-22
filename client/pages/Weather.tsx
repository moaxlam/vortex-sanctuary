import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

interface ForecastResponse {
  current?: {
    temperature_2m?: number;
    precipitation?: number;
    windspeed_10m?: number;
    time?: string;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    precipitation?: number[];
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    sunrise?: string[];
    sunset?: string[];
  };
}

interface ClimateResponse {
  monthly?: {
    time?: string[];
    temperature_2m_mean?: number[];
    precipitation_sum?: number[];
  };
}

const ND = { latitude: 28.6139, longitude: 77.209 };

export default function Weather() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>(
    ND,
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [climate, setClimate] = useState<ClimateResponse | null>(null);
  const [searchResults, setSearchResults] = useState<
    { name: string; country?: string; latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => {},
        { timeout: 3000 },
      );
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const forecastUrl = `/api/weather?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,precipitation,windspeed_10m&hourly=temperature_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&timezone=auto`;
        const r = await fetch(forecastUrl);
        const j = (await r.json()) as ForecastResponse;
        setData(j);
        const climateUrl = `/api/climate?latitude=${coords.latitude}&longitude=${coords.longitude}&models=ERA5&monthly=temperature_2m_mean,precipitation_sum`;
        const rc = await fetch(climateUrl);
        const jc = (await rc.json()) as ClimateResponse;
        setClimate(jc);
      } catch (e: any) {
        setError("Failed to load weather data.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [coords.latitude, coords.longitude]);

  const hourly = useMemo(() => {
    const t = data?.hourly?.time || [];
    const temp = data?.hourly?.temperature_2m || [];
    const pr = data?.hourly?.precipitation || [];
    return t.map((x, i) => ({
      time: x.split("T")[1],
      temp: temp[i],
      rain: pr[i],
    }));
  }, [data]);
  const daily = useMemo(() => {
    const t = data?.daily?.time || [];
    const max = data?.daily?.temperature_2m_max || [];
    const min = data?.daily?.temperature_2m_min || [];
    const pr = data?.daily?.precipitation_sum || [];
    return t.map((x, i) => ({
      day: x,
      tmax: max[i],
      tmin: min[i],
      rain: pr[i],
    }));
  }, [data]);
  const monthly = useMemo(() => {
    const t = (climate as any)?.monthly?.time || [];
    const tm = (climate as any)?.monthly?.temperature_2m_mean || [];
    const pr = (climate as any)?.monthly?.precipitation_sum || [];
    return t.map((x: string, i: number) => ({
      month: x.slice(0, 7),
      tmean: tm[i],
      rain: pr[i],
    }));
  }, [climate]);

  const onSearch = async () => {
    if (!query.trim()) return;
    const r = await fetch(
      `/api/weather?search=${encodeURIComponent(query.trim())}`,
    );
    const j = await r.json();
    setSearchResults(j?.results?.slice(0, 6) ?? []);
  };

  const current = data?.current;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Weather analytics</h1>
      <p className="text-muted-foreground">
        Real‑time forecast, daily outlook and 6‑month climatology.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border p-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : current ? (
            <div className="grid grid-cols-3 gap-4">
              <Info
                label="Temperature"
                value={`${Math.round(current.temperature_2m ?? 0)}°C`}
              />
              <Info
                label="Wind"
                value={`${Math.round(current.windspeed_10m ?? 0)} km/h`}
              />
              <Info
                label="Precipitation"
                value={`${current.precipitation ?? 0} mm`}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data.</p>
          )}
          <div className="mt-6">
            <h3 className="font-semibold">Hourly</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourly} margin={{ left: 10, right: 10 }}>
                  <defs>
                    <linearGradient id="t" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    interval={Math.ceil(hourly.length / 8)}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <Tooltip />
                  <Area dataKey="temp" stroke="#10b981" fill="url(#t)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold">Daily</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daily} margin={{ left: 10, right: 10 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    interval={Math.ceil(daily.length / 7)}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="tmax"
                    stroke="#ef4444"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="tmin"
                    stroke="#3b82f6"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <aside className="rounded-xl border p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Search location</label>
            <div className="mt-2 flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="flex-1 h-10 rounded-md border px-3"
                placeholder="City or place"
              />
              <Button onClick={onSearch} className="h-10">
                Search
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {searchResults.map((r, i) => (
                <button
                  key={`${r.name}-${i}`}
                  onClick={() => {
                    setCoords({ latitude: r.latitude, longitude: r.longitude });
                    setSearchResults([]);
                  }}
                  className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted"
                >
                  {r.name}
                  {r.country ? `, ${r.country}` : ""}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-semibold">Sunrise / Sunset</p>
            <p className="text-xs text-muted-foreground">
              {data?.daily?.sunrise?.[0]} → {data?.daily?.sunset?.[0]}
            </p>
          </div>
          <div>
            <p className="font-semibold">6‑month climatology</p>
            <div className="h-40 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ left: 10, right: 10 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    interval={Math.ceil((monthly?.length || 1) / 6)}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="tmean" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-900">
            <p className="text-sm font-semibold">Insurance insight</p>
            <p className="text-xs">
              Higher rain in next 48h increases crop disease risk. Consider
              short‑term cover.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
