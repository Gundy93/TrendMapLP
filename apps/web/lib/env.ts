function read(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  // Supabase — server only
  SUPABASE_URL: read("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: read("SUPABASE_SERVICE_ROLE_KEY"),
  // Supabase — client safe (RLS로 보호)
  NEXT_PUBLIC_SUPABASE_URL: read("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  // Cloudflare Turnstile
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: read("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
  TURNSTILE_SECRET_KEY: read("TURNSTILE_SECRET_KEY"),
  // Upstash Redis (rate limit)
  UPSTASH_REDIS_REST_URL: read("UPSTASH_REDIS_REST_URL"),
  UPSTASH_REDIS_REST_TOKEN: read("UPSTASH_REDIS_REST_TOKEN"),
} as const;

export const isProduction = env.NODE_ENV === "production";
