import { GoogleGenAI } from "@google/genai";

export async function parseResumeWithGemini(
  file: File,
  apiKey: string
) {
  const ai = new GoogleGenAI({ apiKey });

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const prompt = `
You are an expert ATS resume parser and recruiter.

Analyze the uploaded resume and return ONLY valid JSON.

The JSON must follow exactly this structure:

{
  "full_name": "",
  "email": "",
  "phone": "",
  "github_username": "",
  "linkedin_url": "",
  "summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": []
}

IMPORTANT:

1. Extract the candidate's information accurately from the resume.
2. "summary" must be a concise recruiter-facing professional summary.
3. The summary should be 2-3 sentences.
4. Mention the candidate's strongest technical/professional skills, experience, and notable achievements.
5. Do NOT invent information that is not present in the resume.
6. If a field is unavailable, return an empty string or empty array.
7. Return ONLY JSON. Do not use markdown.
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
    ],
  });

  return response.text ?? "";
}