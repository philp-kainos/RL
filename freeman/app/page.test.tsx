import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

import Home from "./page";

describe("Home page", () => {
  it("renders the main landmark", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the hero heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /premium firewood/i }),
    ).toBeInTheDocument();
  });

  it("links to the products page", () => {
    render(<Home />);
    const links = screen.getAllByRole("link", { name: /shop now|view products/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => expect(link).toHaveAttribute("href", "/products"));
  });

  it("links to the delivery page", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /delivery info/i });
    expect(link).toHaveAttribute("href", "/delivery");
  });
});
