import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the brand name", () => {
    const { getByText } = render(<Footer />);
    expect(getByText("Freeman Firewood")).toBeInTheDocument();
  });

  it("renders a copyright notice", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toMatch(/Freeman Firewood\. All rights reserved\./);
  });
});
