import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots", () => {
  it("allows all crawlers", () => {
    const result = robots();
    expect(result.rules).toMatchObject({ userAgent: "*", allow: "/" });
  });

  it("points to the sitemap", () => {
    const result = robots();
    expect(result.sitemap).toBe("https://freemanfirewood.co.uk/sitemap.xml");
  });
});
