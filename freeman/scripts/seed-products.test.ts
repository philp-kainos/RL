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
vi.mock("@/lib/storage/upload-product-image", () => ({
  uploadProductImage: vi.fn(),
}));
vi.mock("fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs/promises")>();
  return { ...actual, readFile: vi.fn().mockResolvedValue(Buffer.from("<svg/>")) };
});

import { SEED_PRODUCTS, seedProducts } from "./seed-products";
import { uploadProductImage } from "@/lib/storage/upload-product-image";

const mockUploadProductImage = vi.mocked(uploadProductImage);

function makeMockDb() {
  const mockOnConflict = vi.fn().mockResolvedValue([]);
  const mockValues = vi.fn().mockReturnValue({ onConflictDoUpdate: mockOnConflict });
  const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
  return { db: { insert: mockInsert } as unknown as typeof import("@/lib/db").db, mockInsert, mockValues, mockOnConflict };
}

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
  it("calls db.insert with SEED_PRODUCTS when no supabase client is provided", async () => {
    const { db: mockDb, mockInsert, mockValues, mockOnConflict } = makeMockDb();

    await seedProducts(mockDb);

    expect(mockInsert).toHaveBeenCalledOnce();
    expect(mockValues).toHaveBeenCalledWith(SEED_PRODUCTS);
    expect(mockOnConflict).toHaveBeenCalledOnce();
  });

  it("uploads images and sets imageUrl when a supabase client is provided", async () => {
    const { db: mockDb, mockValues } = makeMockDb();
    const mockSupabase = {} as import("@supabase/supabase-js").SupabaseClient;

    mockUploadProductImage.mockImplementation((_sb, slug) =>
      Promise.resolve(`https://example.supabase.co/product-images/${slug}.svg`),
    );

    await seedProducts(mockDb, mockSupabase);

    const calledRows = mockValues.mock.calls[0][0] as Array<{ slug: string; imageUrl?: string }>;
    expect(calledRows).toHaveLength(3);
    for (const row of calledRows) {
      expect(row.imageUrl).toBe(
        `https://example.supabase.co/product-images/${row.slug}.svg`,
      );
    }
  });

  it("falls back to no imageUrl if the upload fails", async () => {
    const { db: mockDb, mockValues } = makeMockDb();
    const mockSupabase = {} as import("@supabase/supabase-js").SupabaseClient;

    mockUploadProductImage.mockRejectedValue(new Error("upload failed"));

    await seedProducts(mockDb, mockSupabase);

    const calledRows = mockValues.mock.calls[0][0] as Array<{ imageUrl?: string }>;
    for (const row of calledRows) {
      expect(row.imageUrl).toBeUndefined();
    }
  });
});
