import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../env", () => ({
  env: {
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  },
}));

const mockCookieStore = {
  getAll: vi.fn().mockReturnValue([]),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(mockCookieStore),
}));

const mockClient = { auth: {} };
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn().mockReturnValue(mockClient),
}));

describe("lib/supabase/server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookieStore.getAll.mockReturnValue([]);
  });

  it("returns a supabase client", async () => {
    const { createSupabaseServerClient } = await import("./server");
    const client = await createSupabaseServerClient();
    expect(client).toBe(mockClient);
  });

  it("passes url and anon key to createServerClient", async () => {
    const { createServerClient } = await import("@supabase/ssr");
    const { createSupabaseServerClient } = await import("./server");
    await createSupabaseServerClient();
    expect(createServerClient).toHaveBeenCalledWith(
      "https://abc.supabase.co",
      "anon-key",
      expect.objectContaining({ cookies: expect.any(Object) })
    );
  });

  it("cookies.getAll delegates to the cookie store", async () => {
    const { createServerClient } = await import("@supabase/ssr");
    const { createSupabaseServerClient } = await import("./server");
    await createSupabaseServerClient();

    const [, , options] = (createServerClient as ReturnType<typeof vi.fn>).mock
      .calls[0] as [string, string, { cookies: { getAll: () => unknown; setAll: (c: unknown[]) => void } }];
    options.cookies.getAll();
    expect(mockCookieStore.getAll).toHaveBeenCalled();
  });

  it("cookies.setAll delegates to the cookie store", async () => {
    const { createServerClient } = await import("@supabase/ssr");
    const { createSupabaseServerClient } = await import("./server");
    await createSupabaseServerClient();

    const [, , options] = (createServerClient as ReturnType<typeof vi.fn>).mock
      .calls[0] as [string, string, { cookies: { getAll: () => unknown; setAll: (c: { name: string; value: string; options: object }[]) => void } }];
    options.cookies.setAll([{ name: "sb-token", value: "abc", options: {} }]);
    expect(mockCookieStore.set).toHaveBeenCalledWith("sb-token", "abc", {});
  });
});
