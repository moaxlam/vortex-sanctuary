import type { RequestHandler } from "express";
import { explainMlPrediction } from "../lib/agrisure-explain";
import type { AgriSureTopFeature } from "../lib/agrisure-explain";

const DEFAULT_URL = "http://127.0.0.1:8000/predict";

function upstreamErrorMessage(payload: unknown): string {
  if (payload == null) return "Prediction failed";
  if (typeof payload === "string") return payload;
  if (typeof payload !== "object") return String(payload);
  const o = payload as Record<string, unknown>;
  if (typeof o.detail === "string") return o.detail;
  if (Array.isArray(o.detail)) {
    return o.detail
      .map((item) =>
        typeof item === "object" && item && "msg" in item
          ? String((item as { msg: unknown }).msg)
          : String(item),
      )
      .join("; ");
  }
  if (typeof o.message === "string") return o.message;
  if (typeof o.error === "string") return o.error;
  try {
    return JSON.stringify(payload);
  } catch {
    return "Prediction failed";
  }
}

function parseTopFeatures(raw: unknown): AgriSureTopFeature[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (Array.isArray(item) && item.length >= 2) {
        return [String(item[0]), Number(item[1])] as AgriSureTopFeature;
      }
      return null;
    })
    .filter((x): x is AgriSureTopFeature => x !== null && !Number.isNaN(x[1]));
}

export const handleAgriSurePredict: RequestHandler = async (req, res) => {
  try {
    const upstream =
      process.env.AGRISURE_API_URL?.replace(/\/$/, "") || DEFAULT_URL;

    const r = await fetch(upstream, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await r.text();
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { error: "invalid_upstream_json", raw: text.slice(0, 500) };
    }

    if (!r.ok) {
      return res.status(r.status).json({
        error: "agrisure_predict_failed",
        detail: upstreamErrorMessage(payload),
      });
    }

    const body = payload as Record<string, unknown>;
    const prediction = Number(body.prediction);
    if (!Number.isFinite(prediction)) {
      return res.status(502).json({
        error: "agrisure_invalid_response",
        detail: "ML service did not return a prediction",
      });
    }

    const top_features = parseTopFeatures(body.top_features);
    const inputs = (req.body ?? {}) as Record<string, unknown>;
    const explanation = await explainMlPrediction(
      prediction,
      top_features,
      inputs,
    );

    return res.json({
      prediction,
      top_features,
      explanation,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const hint =
      message.includes("fetch failed") || message.includes("ECONNREFUSED")
        ? "Start the Python API: pnpm dev:agrisure"
        : undefined;
    return res.status(502).json({
      error: "agrisure_unreachable",
      detail: message,
      hint,
    });
  }
};
