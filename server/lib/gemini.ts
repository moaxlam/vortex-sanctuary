const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models";
const PREFERRED = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

export async function generateGeminiText(
  prompt: string,
  system = "Provide concise, friendly insurance guidance.",
): Promise<{ model: string; text: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || !prompt.trim()) return null;

  let lastErr: unknown = null;
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
          ?.map((p: { text?: string }) => p?.text)
          .filter(Boolean)
          .join("\n");
      if (text) return { model, text };
    } catch (e) {
      lastErr = e;
    }
  }
  console.warn("[gemini] all models failed:", lastErr);
  return null;
}
