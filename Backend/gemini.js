import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function embedText(text, taskType) {
  const response = await ai.models.embedContent({
    model: `gemini-embedding-001`,
    contents: text,
    config: { outputDimensionality: 768, taskType },
  });
  return response.embeddings[0].values;
}
