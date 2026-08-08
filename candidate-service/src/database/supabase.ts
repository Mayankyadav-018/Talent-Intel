import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient(env: CloudflareBindings) {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );
}