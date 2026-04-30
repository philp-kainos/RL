import { render, screen } from "@testing-library/react";
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

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import ProductsPage from "./page";

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
  });

  it("renders the page heading", async () => {
    mockWhere.mockResolvedValue([]);
    const jsx = await ProductsPage();
    render(jsx);
    expect(screen.getByRole("heading", { name: /our products/i })).toBeInTheDocument();
  });

  it("shows empty state when no active products exist", async () => {
    mockWhere.mockResolvedValue([]);
    const jsx = await ProductsPage();
    render(jsx);
    expect(
      screen.getByText(/no products are currently available/i),
    ).toBeInTheDocument();
  });

  it("renders a card for each active product", async () => {
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
      {
        id: 2,
        slug: "kiln-dried-hardwood-10in",
        name: '0.9m³ Kiln-Dried Hardwood Bag (10")',
        description: "A bag of kiln-dried hardwood logs.",
        unitLabel: "0.9m³ bag",
        pricePence: 19000,
        isPoa: false,
        imageUrl: null,
        stock: 5,
        isActive: true,
      },
    ]);
    const jsx = await ProductsPage();
    render(jsx);
    expect(screen.getByText('0.9m³ Kiln-Dried Hardwood Bag (8")')).toBeInTheDocument();
    expect(screen.getByText('0.9m³ Kiln-Dried Hardwood Bag (10")')).toBeInTheDocument();
    expect(screen.getByText("£180.00")).toBeInTheDocument();
    expect(screen.getByText("£190.00")).toBeInTheDocument();
  });

  it("shows POA instead of a price for price-on-application products", async () => {
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
    const jsx = await ProductsPage();
    render(jsx);
    expect(screen.getByText("POA")).toBeInTheDocument();
    expect(screen.queryByText(/£0/)).not.toBeInTheDocument();
  });

  it("links each product card to its detail page", async () => {
    mockWhere.mockResolvedValue([
      {
        id: 1,
        slug: "kiln-dried-hardwood-8in",
        name: '0.9m³ Kiln-Dried Hardwood Bag (8")',
        description: "Logs.",
        unitLabel: "0.9m³ bag",
        pricePence: 18000,
        isPoa: false,
        imageUrl: null,
        stock: 10,
        isActive: true,
      },
    ]);
    const jsx = await ProductsPage();
    render(jsx);
    const link = screen.getByRole("link", { name: /kiln-dried hardwood bag \(8/i });
    expect(link).toHaveAttribute("href", "/products/kiln-dried-hardwood-8in");
  });
});
