import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "E2E requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.local",
  );
}

export const sb = createClient(url, key, {
  auth: { persistSession: false },
});

export async function cleanupE2ESignups(): Promise<void> {
  const { error } = await sb
    .from("signups")
    .delete()
    .like("email", "e2e+%@trendmaplp.test");
  if (error) {
    console.warn("[e2e cleanup] signups delete failed:", error.message);
  }
}
