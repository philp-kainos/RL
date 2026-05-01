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

import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the main landmark", () => {
    render(<AboutPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the page heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { name: /about freeman firewood/i }),
    ).toBeInTheDocument();
  });

  it("mentions kiln-dried logs", () => {
    render(<AboutPage />);
    const matches = screen.getAllByText(/kiln-dried/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("links to the contact page", () => {
    render(<AboutPage />);
    const link = screen.getByRole("link", { name: /get in touch/i });
    expect(link).toHaveAttribute("href", "/contact");
  });
});
