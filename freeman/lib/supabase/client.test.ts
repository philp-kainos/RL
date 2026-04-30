import { describe, it, expect, vi } from "vitest";

vi.mock("../env", () => ({
  env: {
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  },
}));

const mockClient = { auth: {} };
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn().mockReturnValue(mockClient),
}));

describe("lib/supabase/client", () => {
  it("returns a supabase browser client", async () => {
    const { createSupabaseBrowserClient } = await import("./client");
    const client = createSupabaseBrowserClient();
    expect(client).toBe(mockClient);
  });

  it("passes url and anon key to createBrowserClient", async () => {
    const { createBrowserClient } = await import("@supabase/ssr");
    const { createSupabaseBrowserClient } = await import("./client");
    createSupabaseBrowserClient();
    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://abc.supabase.co",
      "anon-key"
    );
  });
});
