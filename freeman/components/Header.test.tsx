import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Header", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the brand name", () => {
    const { getByText } = render(<Header />);
    expect(getByText("Freeman Firewood")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    const { getByRole } = render(<Header />);
    const nav = getByRole("navigation", { name: "Main navigation" });
    expect(nav).toBeInTheDocument();
  });
});
