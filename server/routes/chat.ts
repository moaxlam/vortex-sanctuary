import type { RequestHandler } from "express";

const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models";
const PREFERRED = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

export const handleGemini: RequestHandler = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "missing_gemini_key" });
    const prompt: string = (req.body?.prompt as string) || "";
    const system: string =
      (req.body?.system as string) ||
      "Provide concise, friendly insurance guidance.";
    if (!prompt) return res.status(400).json({ error: "missing_prompt" });

    let lastErr: any = null;
    for (const model of PREFERRED) {
      try {
        const r = await fetch(
          `${GEMINI_API}/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "user-agent": "AgriSure/1.0 (+https://agrisure.app)",
            },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: system }] },
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 0.9,
                maxOutputTokens: 512,
              },
            }),
          },
        );
        if (!r.ok) throw new Error(`gemini_${model}_http_${r.status}`);
        const j = await r.json();
        const text =
          j?.candidates?.[0]?.content?.parts?.[0]?.text ??
          j?.candidates?.[0]?.content?.parts
            ?.map((p: any) => p?.text)
            .filter(Boolean)
            .join("\n");
        return res.json({ model, text });
      } catch (e) {
        lastErr = e;
      }
    }
    return res
      .status(502)
      .json({ error: "gemini_failed", detail: String(lastErr) });
  } catch (e: any) {
    res
      .status(500)
      .json({ error: "gemini_proxy_failed", detail: String(e?.message || e) });
  }
};
