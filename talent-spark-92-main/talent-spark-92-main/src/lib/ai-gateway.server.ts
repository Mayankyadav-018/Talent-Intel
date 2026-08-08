import { GoogleGenAI } from "@google/genai";

function getGemini() {
  const key = process.env.GEMINI_API_KEY;

  console.log("GEMINI KEY EXISTS:", !!key);

  if (!key) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  return new GoogleGenAI({ apiKey: key });
}

/**
 * Generate an AI response using Gemini.
 */
export async function chatCompletion(body: Record<string, unknown>) {
  const ai = getGemini();

  const messages = (body.messages as any[]) || [];

  const systemMessage =
    messages.find((m) => m.role === "system")?.content || "";

  const userMessage =
    messages.find((m) => m.role === "user")?.content || "";

  const prompt = `
${systemMessage}

${userMessage}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    choices: [
      {
        message: {
          content: response.text ?? "",
        },
      },
    ],
  };
}

/**
 * Generate an embedding using Gemini.
 */
export async function embed(text: string): Promise<number[]> {
  const ai = getGemini();

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text.slice(0, 8000),
    config: {
      outputDimensionality: 1536,
    },
  });

  return response.embeddings?.[0]?.values ?? [];
}

/**
 * Calculate cosine similarity between two vectors.
 */
export function cosineSim(a: number[], b: number[]): number {
  if (!a?.length || !b?.length || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}