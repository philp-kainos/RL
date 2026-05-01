import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactPage from "./page";

describe("ContactPage", () => {
  it("renders the main landmark", () => {
    render(<ContactPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the page heading", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
  });

  it("renders an email link", () => {
    render(<ContactPage />);
    const emailLink = screen.getByRole("link", { name: /info@freemanfirewood\.co\.uk/i });
    expect(emailLink).toHaveAttribute("href", "mailto:info@freemanfirewood.co.uk");
  });

  it("renders opening hours", () => {
    render(<ContactPage />);
    expect(screen.getByText(/opening hours/i)).toBeInTheDocument();
  });
});
