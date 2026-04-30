import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { products } from "./products";

describe("products schema", () => {
  it("has the correct table name", () => {
    expect(getTableName(products)).toBe("products");
  });

  it("exposes all required columns", () => {
    expect(products.id).toBeDefined();
    expect(products.slug).toBeDefined();
    expect(products.name).toBeDefined();
    expect(products.description).toBeDefined();
    expect(products.unitLabel).toBeDefined();
    expect(products.pricePence).toBeDefined();
    expect(products.imageUrl).toBeDefined();
    expect(products.stock).toBeDefined();
    expect(products.isActive).toBeDefined();
  });

  it("imageUrl is nullable", () => {
    expect(products.imageUrl.notNull).toBe(false);
  });

  it("stock defaults to 0", () => {
    expect(products.stock.default).toBe(0);
  });

  it("isActive defaults to true", () => {
    expect(products.isActive.default).toBe(true);
  });
});
