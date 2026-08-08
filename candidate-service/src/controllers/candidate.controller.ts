import type { Context } from "hono";
import type { Candidate } from "../types/candidate";
import { createCandidate } from "../services/candidate.service";

export async function createCandidateController(
  c: Context<{ Bindings: CloudflareBindings }>
) {
  try {
    const body = (await c.req.json()) as Candidate;

    // 👇 Add these two lines here
    console.log("SUPABASE_URL:", c.env.SUPABASE_URL);
    console.log(
      "SUPABASE_ANON_KEY:",
      c.env.SUPABASE_ANON_KEY ? "Loaded" : "Missing"
    );

    const candidate = await createCandidate(c.env, body);

    return c.json(
      {
        success: true,
        data: candidate,
      },
      201
    );
  } catch (error) {
  console.error("ERROR:", error);

  return c.json(
    {
      success: false,
      error: error instanceof Error ? error.message : error,
    },
    400
  );
}}