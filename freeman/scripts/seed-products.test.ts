import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/env", () => ({
  env: {
    DATABASE_URL: "postgresql://test",
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  },
}));

import { SEED_PRODUCTS, seedProducts } from "./seed-products";

describe("SEED_PRODUCTS", () => {
  it("contains exactly 3 products", () => {
    expect(SEED_PRODUCTS).toHaveLength(3);
  });

  it("includes the 8-inch kiln-dried hardwood bag", () => {
    const product = SEED_PRODUCTS.find(
      (p) => p.slug === "kiln-dried-hardwood-8in",
    );
    expect(product).toBeDefined();
    expect(product?.isPoa).toBe(false);
    expect(product?.isActive).toBe(true);
  });

  it("includes the 10-inch kiln-dried hardwood bag", () => {
    const product = SEED_PRODUCTS.find(
      (p) => p.slug === "kiln-dried-hardwood-10in",
    );
    expect(product).toBeDefined();
    expect(product?.isPoa).toBe(false);
    expect(product?.isActive).toBe(true);
  });

  it("marks force-dried woodchip as POA", () => {
    const product = SEED_PRODUCTS.find((p) => p.slug === "force-dried-woodchip");
    expect(product).toBeDefined();
    expect(product?.isPoa).toBe(true);
    expect(product?.isActive).toBe(true);
  });
});

describe("seedProducts", () => {
  it("calls db.insert with the products table and all seed data", async () => {
    const mockOnConflict = vi.fn().mockResolvedValue([]);
    const mockValues = vi
      .fn()
      .mockReturnValue({ onConflictDoUpdate: mockOnConflict });
    const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
    const mockDb = { insert: mockInsert } as unknown as typeof import("@/lib/db").db;

    await seedProducts(mockDb);

    expect(mockInsert).toHaveBeenCalledOnce();
    expect(mockValues).toHaveBeenCalledWith(SEED_PRODUCTS);
    expect(mockOnConflict).toHaveBeenCalledOnce();
  });
});
