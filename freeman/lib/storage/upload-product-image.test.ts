import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockFrom = vi.fn();

const mockSupabase = {
  storage: { from: mockFrom },
} as unknown as SupabaseClient;

import { uploadProductImage } from "./upload-product-image";

describe("uploadProductImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ upload: mockUpload, getPublicUrl: mockGetPublicUrl });
    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://abc.supabase.co/storage/v1/object/public/product-images/test-slug.jpg" },
    });
  });

  it("calls storage.from with the product-images bucket", async () => {
    await uploadProductImage(mockSupabase, "test-slug", new Uint8Array([0]), "image/jpeg");
    expect(mockFrom).toHaveBeenCalledWith("product-images");
  });

  it("uploads with the correct path and contentType for jpeg", async () => {
    const data = new Uint8Array([1, 2, 3]);
    await uploadProductImage(mockSupabase, "test-slug", data, "image/jpeg");
    expect(mockUpload).toHaveBeenCalledWith("test-slug.jpg", data, {
      contentType: "image/jpeg",
      upsert: true,
    });
  });

  it("maps image/svg+xml to a .svg extension", async () => {
    await uploadProductImage(mockSupabase, "test-slug", new Uint8Array([0]), "image/svg+xml");
    expect(mockUpload).toHaveBeenCalledWith(
      "test-slug.svg",
      expect.any(Uint8Array),
      expect.objectContaining({ contentType: "image/svg+xml" }),
    );
  });

  it("maps image/png to a .png extension", async () => {
    await uploadProductImage(mockSupabase, "test-slug", new Uint8Array([0]), "image/png");
    expect(mockUpload).toHaveBeenCalledWith(
      "test-slug.png",
      expect.any(Uint8Array),
      expect.anything(),
    );
  });

  it("returns the public URL", async () => {
    const url = await uploadProductImage(
      mockSupabase,
      "test-slug",
      new Uint8Array([0]),
      "image/jpeg",
    );
    expect(url).toBe(
      "https://abc.supabase.co/storage/v1/object/public/product-images/test-slug.jpg",
    );
  });

  it("throws when upload returns an error", async () => {
    mockUpload.mockResolvedValue({ error: { message: "permission denied" } });
    await expect(
      uploadProductImage(mockSupabase, "test-slug", new Uint8Array([0]), "image/jpeg"),
    ).rejects.toThrow("Failed to upload test-slug.jpg: permission denied");
  });
});
