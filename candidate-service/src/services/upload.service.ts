import { createSupabaseClient } from "../database/supabase";
import { parseResumeWithGemini } from "./gemini.service";
import { createCandidate } from "./candidate.service";
import { calculateTalentScore } from "../utils/scoreCandidate";

export async function uploadResume(
  env: CloudflareBindings,
  file: File,
  userData: {
    full_name: string;
    email: string;
    github_username: string;
  }
){
  const supabase = createSupabaseClient(env);

  // Upload PDF
  const fileName = `${crypto.randomUUID()}-${file.name}`;

  const { data, error } = await supabase.storage
  .from("resumes")
  .upload(fileName, file);

console.log("Upload Result:", data);
console.log("Upload Error:", error);

if (error) {
  console.error("Supabase Upload Error:", error);
  throw error;
}

  const { data: publicUrl } = supabase.storage
    .from("resumes")
    .getPublicUrl(fileName);

  // Parse using Gemini
  // Parse using Gemini
const geminiResult = await parseResumeWithGemini(
  file,
  env.GEMINI_API_KEY
);

// Remove the ```json and ``` added by Gemini
const cleaned = geminiResult
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("Gemini Raw:", geminiResult);
console.log("Gemini Cleaned:", cleaned);

let parsedResume;
let score;

try {
  parsedResume = JSON.parse(cleaned);

  score = calculateTalentScore(parsedResume);

  console.log("Candidate Score:", score);
} catch (error) {
  console.error("JSON Parse Failed:", error);
  throw new Error("Gemini returned invalid JSON");
}

// Convert JSON string into JavaScript object
const candidate = await createCandidate(env, {
  full_name: parsedResume.full_name || userData.full_name,
  email: parsedResume.email || userData.email,
  phone: parsedResume.phone,

  github_username:
    parsedResume.github_username || userData.github_username,

  linkedin_url: parsedResume.linkedin_url,

  // Save the uploaded resume URL
  resume_url: publicUrl.publicUrl,

  // Save Gemini-generated recruiter summary
  summary: parsedResume.summary,

  // Save AI talent score
  ai_talent_score: score.total,
  score_breakdown: score.breakdown,
});

return {
  candidate,
  resume: {
    fileName,
    url: publicUrl.publicUrl,
  },
  parsedResume,
}};