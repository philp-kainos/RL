// Run with: npx tsx scripts/seed-products.ts
import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { products } from "@/lib/schema/products";

export const SEED_PRODUCTS: (typeof products.$inferInsert)[] = [
  {
    slug: "kiln-dried-hardwood-8in",
    name: '0.9m³ Kiln-Dried Hardwood Bag (8")',
    description:
      "A 0.9m³ bag of kiln-dried hardwood logs split to 8 inches. Ready to burn straight from the bag — moisture content below 20%.",
    unitLabel: "0.9m³ bag",
    pricePence: 0, // TODO(freeman): confirm price for 8" bag
    isPoa: false,
    stock: 0,
    isActive: true,
  },
  {
    slug: "kiln-dried-hardwood-10in",
    name: '0.9m³ Kiln-Dried Hardwood Bag (10")',
    description:
      "A 0.9m³ bag of kiln-dried hardwood logs split to 10 inches. Ready to burn straight from the bag — moisture content below 20%.",
    unitLabel: "0.9m³ bag",
    pricePence: 0, // TODO(freeman): confirm price for 10" bag
    isPoa: false,
    stock: 0,
    isActive: true,
  },
  {
    slug: "force-dried-woodchip",
    name: "Force-Dried Woodchip",
    description:
      "High-quality force-dried woodchip. Price available on application — contact us for a tailored quote.",
    unitLabel: "load",
    pricePence: 0,
    isPoa: true,
    stock: 0,
    isActive: true,
  },
];

export async function seedProducts(database = db): Promise<void> {
  await database
    .insert(products)
    .values(SEED_PRODUCTS)
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        unitLabel: sql`excluded.unit_label`,
        pricePence: sql`excluded.price_pence`,
        isPoa: sql`excluded.is_poa`,
        isActive: sql`excluded.is_active`,
      },
    });
}
