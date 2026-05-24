import type { RequestHandler } from "express";
import { generateGeminiText } from "../lib/gemini";

export const handleGemini: RequestHandler = async (req, res) => {
  try {
    const prompt: string = (req.body?.prompt as string) || "";
    const system: string =
      (req.body?.system as string) ||
      "Provide concise, friendly insurance guidance.";
    if (!prompt) return res.status(400).json({ error: "missing_prompt" });

    const result = await generateGeminiText(prompt, system);
    if (!result) {
      return res.status(500).json({ error: "missing_gemini_key" });
    }
    return res.json(result);
  } catch (e: unknown) {
    res.status(500).json({
      error: "gemini_proxy_failed",
      detail: e instanceof Error ? e.message : String(e),
    });
  }
};
