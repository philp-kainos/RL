import { describe, it, expect, vi, beforeAll } from "vitest";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

vi.mock("postgres", () => ({
  default: vi.fn(() => ({})),
}));

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: vi.fn((client) => ({ client })),
}));

vi.mock("./env", () => ({
  env: {
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  },
}));

describe("lib/db", () => {
  let db: unknown;

  beforeAll(async () => {
    const mod = await import("./db");
    db = mod.db;
  });

  it("exports a db client", () => {
    expect(db).toBeDefined();
  });

  it("creates the postgres client with DATABASE_URL", () => {
    expect(postgres).toHaveBeenCalledWith(
      "postgresql://user:pass@localhost:5432/db"
    );
  });

  it("passes the sql client to drizzle", () => {
    expect(drizzle).toHaveBeenCalledWith(expect.any(Object));
  });
});
