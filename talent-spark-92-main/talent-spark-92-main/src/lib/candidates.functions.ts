import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const listCandidates = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("candidates")
    .select("*")
    .limit(100);

  if (error) throw error;

  return data;
});
export const getCandidate = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data }) => {
    console.log("STEP 1");

    const mod = await import("@/integrations/supabase/client.server");

    console.log("STEP 2");
    console.log(mod);

    const { supabaseAdmin } = mod;

    console.log("STEP 3");

    const result = await supabaseAdmin
      .from("candidates")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();

    console.log("STEP 4");
    console.log(result);

    return result.data;
  });
const UpdateInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().max(255).optional().or(z.literal("")),
  github_username: z.string().max(60).optional().or(z.literal("")),
  summary: z.string().max(2000).optional(),
});

export const updateCandidate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => UpdateInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.email !== undefined) patch.email = data.email || null;
    if (data.github_username !== undefined) patch.github_username = data.github_username || null;
    if (data.summary !== undefined) patch.summary = data.summary;
    const { error } = await supabaseAdmin
      .from("candidates" as any)
      .update(patch as any)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCandidate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("candidates" as any)
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
