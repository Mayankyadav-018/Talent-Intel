import { createSupabaseClient } from "../database/supabase";
import type { Candidate } from "../types/candidate";

export async function createCandidate(
  env: CloudflareBindings,
  candidate: Candidate
) {
  const supabase = createSupabaseClient(env);

  const { data, error } = await supabase
    .from("candidates")
    .upsert(candidate, {
    onConflict: "email",
  })
    .select()
    .single();

  if (error) {
  console.error("Database error:", error);

  throw new Error(
    error.code === "23505"
      ? "Candidate with this email already exists"
      : error.message
  );
}
  return data;
}