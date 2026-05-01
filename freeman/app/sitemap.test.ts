import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockWhere, mockFrom, mockSelect } = vi.hoisted(() => {
  const mockWhere = vi.fn();
  const mockFrom = vi.fn(() => ({ where: mockWhere }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  return { mockWhere, mockFrom, mockSelect };
});

vi.mock("@/lib/db", () => ({
  db: { select: mockSelect },
}));

vi.mock("@/lib/schema/products", () => ({
  products: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

import sitemap from "./sitemap";

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
  });

  it("includes all static pages", async () => {
    mockWhere.mockResolvedValue([]);
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://freemanfirewood.co.uk");
    expect(urls).toContain("https://freemanfirewood.co.uk/products");
    expect(urls).toContain("https://freemanfirewood.co.uk/about");
    expect(urls).toContain("https://freemanfirewood.co.uk/delivery");
    expect(urls).toContain("https://freemanfirewood.co.uk/faqs");
    expect(urls).toContain("https://freemanfirewood.co.uk/contact");
  });

  it("adds a URL for each active product", async () => {
    mockWhere.mockResolvedValue([
      { slug: "kiln-dried-8in" },
      { slug: "kiln-dried-10in" },
    ]);
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(
      "https://freemanfirewood.co.uk/products/kiln-dried-8in",
    );
    expect(urls).toContain(
      "https://freemanfirewood.co.uk/products/kiln-dried-10in",
    );
  });

  it("returns priority 1.0 for the home page", async () => {
    mockWhere.mockResolvedValue([]);
    const entries = await sitemap();
    const home = entries.find((e) => e.url === "https://freemanfirewood.co.uk");
    expect(home?.priority).toBe(1.0);
  });

  it("returns no product URLs when there are no active products", async () => {
    mockWhere.mockResolvedValue([]);
    const entries = await sitemap();
    const productEntries = entries.filter((e) =>
      e.url.includes("/products/"),
    );
    expect(productEntries).toHaveLength(0);
  });
});
