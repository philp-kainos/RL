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

import DeliveryPage from "./page";

describe("DeliveryPage", () => {
  it("renders the main landmark", () => {
    render(<DeliveryPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the page heading", () => {
    render(<DeliveryPage />);
    expect(screen.getByRole("heading", { name: /^delivery$/i })).toBeInTheDocument();
  });

  it("lists the HR postcode area", () => {
    render(<DeliveryPage />);
    expect(screen.getByText(/Herefordshire/)).toBeInTheDocument();
  });

  it("lists the GL postcode area", () => {
    render(<DeliveryPage />);
    expect(screen.getByText(/Gloucestershire/)).toBeInTheDocument();
  });

  it("lists the WR postcode area", () => {
    render(<DeliveryPage />);
    expect(screen.getByText(/Worcestershire/)).toBeInTheDocument();
  });

  it("links to the contact page", () => {
    render(<DeliveryPage />);
    const link = screen.getByRole("link", { name: /contact us/i });
    expect(link).toHaveAttribute("href", "/contact");
  });
});
