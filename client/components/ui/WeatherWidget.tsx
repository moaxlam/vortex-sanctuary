import { useEffect, useState } from "react";

interface CompactWeather {
  temperature?: number;
  windspeed?: number;
  precipitation?: number;
}

const DEFAULT_LOCATION = { latitude: 28.6139, longitude: 77.209 }; // New Delhi

export function WeatherWidget() {
  const [data, setData] = useState<CompactWeather | null>(null);
  const [place, setPlace] = useState("New Delhi");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = async () => {
      try {
        let lat = DEFAULT_LOCATION.latitude;
        let lon = DEFAULT_LOCATION.longitude;
        if (navigator.geolocation) {
          await new Promise<void>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
                resolve();
              },
              () => resolve(),
              { timeout: 2500 },
            );
          });
        }
        const url = `/api/weather?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,windspeed_10m&timezone=auto`;
        const res = await fetch(url);
        const json = await res.json();
        const temperature = json?.current?.temperature_2m;
        const windspeed = json?.current?.windspeed_10m;
        const precipitation = json?.current?.precipitation;
        setData({ temperature, windspeed, precipitation });
        setPlace(json?.timezone ?? place);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    get();
  }, []);

  return (
    <div className="rounded-xl border bg-card text-card-foreground p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Local Weather</p>
        <a className="text-sm text-primary hover:underline" href="/weather">
          Open full
        </a>
      </div>
      {loading ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading weather…</p>
      ) : data ? (
        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <Stat label="Temp" value={`${Math.round(data.temperature ?? 0)}°C`} />
          <Stat
            label="Wind"
            value={`${Math.round(data.windspeed ?? 0)} km/h`}
          />
          <Stat label="Rain" value={`${data.precipitation ?? 0} mm`} />
        </div>
      ) : (
        <p className="mt-3 text-sm text-destructive">Unable to load weather.</p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">{place}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}
