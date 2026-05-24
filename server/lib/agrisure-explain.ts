import { generateGeminiText } from "./gemini";

export type AgriSureTopFeature = [string, number];

function labelFeature(key: string): string {
  return key.replace(/_/g, " ");
}

export function buildMlExplanation(
  prediction: number,
  topFeatures: AgriSureTopFeature[],
  inputs: Record<string, unknown>,
): string {
  const inputSummary = Object.entries(inputs)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([k, v]) => `${labelFeature(k)} (${v})`)
    .join(", ");

  const drivers = topFeatures
    .map(([name, impact]) => {
      const direction = impact >= 0 ? "raised" : "lowered";
      return `• ${labelFeature(name)} ${direction} the estimate (impact ${impact.toFixed(2)})`;
    })
    .join("\n");

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(prediction);

  return `Based on your inputs (${inputSummary || "see form above"}), the model estimates sum insured of ${formatted}.

Main drivers:
${drivers || "• Model used baseline PMFBY policy patterns for your selections."}

Compare this estimate with official PMFBY notifications and your insurer before purchasing. This is for decision-support purposes only.`;
}

export async function explainMlPrediction(
  prediction: number,
  topFeatures: AgriSureTopFeature[],
  inputs: Record<string, unknown>,
): Promise<string> {
  const featureText = Object.entries(inputs)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  const topText = topFeatures
    .map(
      ([f, v]) =>
        `${f} (value=${inputs[f] ?? "—"}) contributed ${v.toFixed(2)}`,
    )
    .join("\n");

  const prompt = `You are a helpful agricultural insurance assistant.

Predicted sum insured (INR): ${prediction}.

User input:
${featureText}

Top SHAP factors:
${topText}

Write 7–10 clear sentences for a farmer. Explain how factors raised or lowered the estimate. End with: "This is for decision-support purposes only." Do not invent facts beyond the inputs and factors.`;

  const gemini = await generateGeminiText(
    prompt,
    "You explain PMFBY crop insurance estimates in simple language.",
  );
  if (gemini?.text) return gemini.text.trim();

  return buildMlExplanation(prediction, topFeatures, inputs);
}
