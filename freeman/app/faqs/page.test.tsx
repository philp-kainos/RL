import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FaqsPage from "./page";

describe("FaqsPage", () => {
  it("renders the main landmark", () => {
    render(<FaqsPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the page heading", () => {
    render(<FaqsPage />);
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeInTheDocument();
  });

  it("renders the kiln-dried FAQ", () => {
    render(<FaqsPage />);
    expect(screen.getByText(/what does kiln-dried mean/i)).toBeInTheDocument();
  });

  it("renders a FAQ about delivery area", () => {
    render(<FaqsPage />);
    expect(screen.getByText(/do you deliver to my area/i)).toBeInTheDocument();
  });

  it("renders all FAQ items", () => {
    render(<FaqsPage />);
    const terms = screen.getAllByRole("term");
    expect(terms.length).toBeGreaterThanOrEqual(4);
  });
});
