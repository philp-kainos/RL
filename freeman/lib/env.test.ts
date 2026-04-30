import { describe, it, expect, beforeEach, vi } from "vitest";

const validEnv = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
  NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
};

describe("lib/env", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("exports typed env when all required vars are present", async () => {
    vi.stubEnv("DATABASE_URL", validEnv.DATABASE_URL);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", validEnv.NEXT_PUBLIC_SUPABASE_URL);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", validEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", validEnv.SUPABASE_SERVICE_ROLE_KEY);

    const { env } = await import("./env");

    expect(env.DATABASE_URL).toBe(validEnv.DATABASE_URL);
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(validEnv.NEXT_PUBLIC_SUPABASE_URL);
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(validEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe(validEnv.SUPABASE_SERVICE_ROLE_KEY);
  });

  it("throws when a required variable is missing", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", validEnv.NEXT_PUBLIC_SUPABASE_URL);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", validEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", validEnv.SUPABASE_SERVICE_ROLE_KEY);

    await expect(import("./env")).rejects.toThrow();
  });

  it("throws when DATABASE_URL is not a valid URL", async () => {
    vi.stubEnv("DATABASE_URL", "not-a-url");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", validEnv.NEXT_PUBLIC_SUPABASE_URL);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", validEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", validEnv.SUPABASE_SERVICE_ROLE_KEY);

    await expect(import("./env")).rejects.toThrow();
  });
});
