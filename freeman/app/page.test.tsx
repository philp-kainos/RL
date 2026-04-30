import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // reason: next/image is not available in jsdom
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
