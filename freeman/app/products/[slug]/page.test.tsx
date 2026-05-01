import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockWhere, mockFrom, mockSelect, mockNotFound } = vi.hoisted(() => {
  const mockWhere = vi.fn();
  const mockFrom = vi.fn(() => ({ where: mockWhere }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  const mockNotFound = vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  });
  return { mockWhere, mockFrom, mockSelect, mockNotFound };
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

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

import ProductDetailPage, { generateMetadata } from "./page";

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
  });

  it("renders product details when slug matches", async () => {
    mockWhere.mockResolvedValue([
      {
        id: 1,
        slug: "kiln-dried-hardwood-8in",
        name: '0.9m³ Kiln-Dried Hardwood Bag (8")',
        description: "A bag of kiln-dried hardwood logs.",
        unitLabel: "0.9m³ bag",
        pricePence: 18000,
        isPoa: false,
        imageUrl: null,
        stock: 10,
        isActive: true,
      },
    ]);

    const jsx = await ProductDetailPage({
      params: Promise.resolve({ slug: "kiln-dried-hardwood-8in" }),
    });
    render(jsx);

    expect(
      screen.getByRole("heading", { name: /kiln-dried hardwood bag/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A bag of kiln-dried hardwood logs."),
    ).toBeInTheDocument();
    expect(screen.getByText("£180.00")).toBeInTheDocument();
    expect(screen.getByText("0.9m³ bag")).toBeInTheDocument();
  });

  it("shows POA for price-on-application products", async () => {
    mockWhere.mockResolvedValue([
      {
        id: 3,
        slug: "woodchip",
        name: "Force-Dried Woodchip",
        description: "Force-dried woodchip.",
        unitLabel: "per tonne",
        pricePence: 0,
        isPoa: true,
        imageUrl: null,
        stock: 0,
        isActive: true,
      },
    ]);

    const jsx = await ProductDetailPage({
      params: Promise.resolve({ slug: "woodchip" }),
    });
    render(jsx);

    expect(screen.getByText("POA")).toBeInTheDocument();
    expect(screen.queryByText(/£0/)).not.toBeInTheDocument();
  });

  it("calls notFound when slug does not match any product", async () => {
    mockWhere.mockResolvedValue([]);

    await expect(
      ProductDetailPage({ params: Promise.resolve({ slug: "nonexistent" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalledOnce();
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
  });

  it("returns title and description for a known product", async () => {
    mockWhere.mockResolvedValue([
      {
        id: 1,
        slug: "kiln-dried-hardwood-8in",
        name: '0.9m³ Kiln-Dried Hardwood Bag (8")',
        description: "A bag of kiln-dried hardwood logs.",
        unitLabel: "0.9m³ bag",
        pricePence: 18000,
        isPoa: false,
        imageUrl: null,
        stock: 10,
        isActive: true,
      },
    ]);

    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "kiln-dried-hardwood-8in" }),
    });

    expect(meta.title).toBe('0.9m³ Kiln-Dried Hardwood Bag (8")');
    expect(meta.description).toBe("A bag of kiln-dried hardwood logs.");
  });

  it("returns empty object for an unknown slug", async () => {
    mockWhere.mockResolvedValue([]);

    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "nonexistent" }),
    });

    expect(meta).toEqual({});
  });

  it("includes openGraph url for a known product", async () => {
    mockWhere.mockResolvedValue([
      {
        id: 1,
        slug: "kiln-dried-hardwood-8in",
        name: '0.9m³ Kiln-Dried Hardwood Bag (8")',
        description: "A bag of kiln-dried hardwood logs.",
        unitLabel: "0.9m³ bag",
        pricePence: 18000,
        isPoa: false,
        imageUrl: null,
        stock: 10,
        isActive: true,
      },
    ]);

    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "kiln-dried-hardwood-8in" }),
    });

    expect((meta.openGraph as { url?: string })?.url).toBe(
      "https://freemanfirewood.co.uk/products/kiln-dried-hardwood-8in",
    );
  });
});
