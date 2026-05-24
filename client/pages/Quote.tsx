import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatApiError, formatCurrency } from "@/lib/utils";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type {
  AgriSurePredictRequest,
  AgriSurePredictResponse,
} from "@shared/api";

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#64748b"];

type Loc = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export default function Quote() {
  const [product, setProduct] = useState("crop");
  const [coverage, setCoverage] = useState("Standard");
  const [acreage, setAcreage] = useState(5);
  const [sumInsured, setSumInsured] = useState(500); // per acre
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Loc[]>([]);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [forecast, setForecast] = useState<any>(null);

  const [mlCrop, setMlCrop] = useState("Pulses");
  const [mlCategory, setMlCategory] = useState("Pulses");
  const [mlState, setMlState] = useState("Goa");
  const [mlScheme, setMlScheme] = useState("Pradhan Mantri Fasal Bima Yojana");
  const [mlInsurer, setMlInsurer] = useState(
    "FUTURE GENERALI INDIA INSURANCE CO. LTD.",
  );
  const [mlDistrict, setMlDistrict] = useState("North Goa");
  const [mlSeason, setMlSeason] = useState("Kharif");
  const [mlReferenceSumInsured, setMlReferenceSumInsured] = useState("37500");
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState<string | null>(null);
  const [mlResult, setMlResult] = useState<AgriSurePredictResponse | null>(
    null,
  );

  useEffect(() => {
    // geolocate default
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) =>
          setCoords({
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
          }),
        () => {},
        { timeout: 3000 },
      );
    }
  }, []);

  useEffect(() => {
    // load weather when coords changes
    const run = async () => {
      if (!coords) return;
      const url = `/api/weather?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const r = await fetch(url);
      const j = await r.json();
      setForecast(j);
    };
    run();
  }, [coords?.latitude, coords?.longitude]);

  const riskFactor = useMemo(() => {
    const rain3 = (forecast?.daily?.precipitation_sum || [])
      .slice(0, 3)
      .reduce((a: number, b: number) => a + (b || 0), 0);
    if (rain3 > 20) return 1.2; // heavy rain risk
    if (rain3 > 5) return 1.1;
    return 1.0;
  }, [forecast]);

  const coverageFactor =
    coverage === "Basic" ? 0.85 : coverage === "Comprehensive" ? 1.2 : 1.0;
  const baseRate =
    product === "crop"
      ? 0.035
      : product === "livestock"
        ? 0.03
        : product === "health"
          ? 0.06
          : 0.025;

  const premium = Math.max(
    1,
    Math.round(sumInsured * acreage * baseRate * coverageFactor * riskFactor),
  );
  const fees = Math.round(premium * 0.03);
  const tax = Math.round((premium + fees) * 0.18);
  const total = premium + fees + tax;

  const data = [
    { name: "Base", value: premium },
    { name: "Fees", value: fees },
    { name: "Tax", value: tax },
    { name: "Total", value: total },
  ];

  const search = async () => {
    if (!query.trim()) return;
    const r = await fetch(
      `/api/weather?search=${encodeURIComponent(query.trim())}`,
    );
    const j = await r.json();
    setResults(j?.results?.slice(0, 6) || []);
  };

  const runMlPredict = async () => {
    setMlLoading(true);
    setMlError(null);
    setMlResult(null);
    const body: AgriSurePredictRequest = {
      cropname: mlCrop,
      categoryname: mlCategory,
      sssyname_schemename: mlScheme,
      sssyname_statename: mlState,
      insurancecompany_insurancecompanyname: mlInsurer,
      district: mlDistrict,
      season: mlSeason,
      suminsured: mlReferenceSumInsured,
    };
    try {
      const r = await fetch("/api/agrisure/predict", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) {
        throw new Error(formatApiError(j));
      }
      if (typeof j?.prediction !== "number") {
        throw new Error(formatApiError(j) || "Invalid prediction response");
      }
      setMlResult({
        prediction: j.prediction,
        top_features: Array.isArray(j.top_features) ? j.top_features : [],
        explanation:
          typeof j.explanation === "string"
            ? j.explanation
            : formatApiError(j.explanation) || "",
      });
    } catch (e: unknown) {
      setMlError(e instanceof Error ? e.message : String(e));
    } finally {
      setMlLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Get a quote</h1>
      <p className="text-muted-foreground">
        Quick estimate with weather‑aware risk factor. For an official quote,
        proceed to purchase with KYC.
      </p>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <section className="rounded-xl border bg-card p-6 space-y-3 lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Product</label>
              <select
                className="mt-1 h-10 w-full rounded-md border px-3"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="crop">Crop</option>
                <option value="health">Health</option>
                <option value="livestock">Livestock</option>
                <option value="motor">Motor</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Coverage</label>
              <select
                className="mt-1 h-10 w-full rounded-md border px-3"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
              >
                <option>Basic</option>
                <option>Standard</option>
                <option>Comprehensive</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Acreage</label>
              <input
                type="number"
                min={1}
                className="mt-1 h-10 w-full rounded-md border px-3"
                value={acreage}
                onChange={(e) => setAcreage(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Sum insured per acre (USD)
              </label>
              <input
                type="number"
                min={100}
                className="mt-1 h-10 w-full rounded-md border px-3"
                value={sumInsured}
                onChange={(e) => setSumInsured(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <div className="mt-1 flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Search city or village"
                className="h-10 flex-1 rounded-md border px-3"
              />
              <Button className="h-10" onClick={search}>
                Search
              </Button>
            </div>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {results.map((r) => (
                <button
                  key={`${r.name}-${r.latitude}`}
                  onClick={() => {
                    setCoords({ latitude: r.latitude, longitude: r.longitude });
                    setResults([]);
                    setQuery(`${r.name}${r.country ? `, ${r.country}` : ""}`);
                  }}
                  className="rounded-md border px-3 py-2 text-left hover:bg-muted"
                >
                  {r.name}
                  {r.country ? `, ${r.country}` : ""}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Risk factor from 3‑day rain outlook: x{riskFactor.toFixed(2)}
            </p>
          </div>
        </section>

        <aside className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Estimated total</p>
          <p className="text-3xl font-extrabold">{formatCurrency(total)}</p>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={data.slice(0, 3)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {data.slice(0, 3).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-sm space-y-1">
            <Row k="Premium" v={formatCurrency(premium)} />
            <Row k="Fees" v={formatCurrency(fees)} />
            <Row k="Tax" v={formatCurrency(tax)} />
            <Row k="Total" v={formatCurrency(total)} />
          </div>
          <Button asChild className="mt-4 w-full">
            <a href={`/assistant`}>Ask Assistant to proceed</a>
          </Button>
        </aside>
      </div>

      <section className="mt-12 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-bold">PMFBY coverage estimate (ML)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Uses your LightGBM model on PMFBY data with SHAP factors and a Gemini
          explanation. Run{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            pnpm dev:agrisure
          </code>{" "}
          in a second terminal while the app is running.
        </p>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="Crop" value={mlCrop} onChange={setMlCrop} />
          <Field label="Category" value={mlCategory} onChange={setMlCategory} />
          <Field label="State" value={mlState} onChange={setMlState} />
          <Field label="District" value={mlDistrict} onChange={setMlDistrict} />
          <Field label="Season" value={mlSeason} onChange={setMlSeason} />
          <Field
            label="Reference sum insured (INR)"
            value={mlReferenceSumInsured}
            onChange={setMlReferenceSumInsured}
            type="number"
            hint="Optional: narrows PMFBY lookup. Model predicts the amount below."
          />
          <Field label="Scheme" value={mlScheme} onChange={setMlScheme} />
          <div className="sm:col-span-2">
            <Field label="Insurer" value={mlInsurer} onChange={setMlInsurer} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={runMlPredict} disabled={mlLoading}>
            {mlLoading ? "Predicting…" : "Run ML estimate"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setMlCrop("Pulses");
              setMlCategory("Pulses");
              setMlState("Goa");
              setMlScheme("Pradhan Mantri Fasal Bima Yojana");
              setMlInsurer("FUTURE GENERALI INDIA INSURANCE CO. LTD.");
              setMlDistrict("North Goa");
              setMlSeason("Kharif");
              setMlReferenceSumInsured("37500");
            }}
          >
            Load sample
          </Button>
        </div>

        {mlError && (
          <p className="mt-4 text-sm text-destructive">{mlError}</p>
        )}

        {mlResult && (
          <div className="mt-6 rounded-lg border bg-muted/30 p-4 space-y-3">
            <p className="text-lg font-semibold">
              Predicted sum insured:{" "}
              {formatCurrency(mlResult.prediction, "INR")}
            </p>
            <div>
              <p className="text-sm font-medium">Top factors (SHAP)</p>
              <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5">
                {mlResult.top_features.map(([name, impact]) => (
                  <li key={name}>
                    {name}: {impact.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {mlResult.explanation}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        className="mt-1 h-10 w-full rounded-md border px-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
