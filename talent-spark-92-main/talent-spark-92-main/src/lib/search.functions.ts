import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SearchInput = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(20).optional(),
});

export const searchCandidates = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchInput.parse(input))
  .handler(async ({ data }) => {
    const { embed, chatCompletion, cosineSim } = await import("./ai-gateway.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const limit = data.limit ?? 8;
    const qEmb = await embed(data.query);

    const { data: rows, error } = await supabaseAdmin
      .from("candidates" as any)
      .select(
        "id,name,github_username,summary,ai_talent_score,score_breakdown,embedding,verification_flags,github_metrics",
      )
      .limit(200);
    if (error) throw new Error(error.message);

    const scored = (rows as any[])
      .map((r) => {
        const sim = cosineSim(qEmb, (r.embedding as number[]) || []);
        // Blend semantic similarity (0..1) with normalized talent score
        const rank = sim * 0.7 + ((r.ai_talent_score || 0) / 100) * 0.3;
        return { ...r, similarity: sim, rank };
      })
      .sort((a, b) => b.rank - a.rank)
      .slice(0, limit);

    // Generate a copilot answer summarizing why these candidates match
    let copilotAnswer = "";
    try {
      const context = scored
        .map((c, i) => `${i + 1}. ${c.name} (score ${c.ai_talent_score}): ${c.summary || ""}`)
        .join("\n");
      const answer = await chatCompletion({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a recruiter AI copilot. Given a query and a shortlist of candidates, write a 2-3 sentence explanation of why these candidates match. Reference names briefly. Plain text.",
          },
          { role: "user", content: `Query: ${data.query}\n\nShortlist:\n${context}` },
        ],
      });
      copilotAnswer = answer?.choices?.[0]?.message?.content?.trim() || "";
    } catch (e) {
      copilotAnswer = "";
    }

    return {
      answer: copilotAnswer,
      results: scored.map((c) => ({
        id: c.id,
        name: c.name,
        github_username: c.github_username,
        summary: c.summary,
        ai_talent_score: c.ai_talent_score,
        score_breakdown: c.score_breakdown,
        verification_flags: c.verification_flags,
        similarity: Math.round(c.similarity * 100) / 100,
      })),
    };
  });
