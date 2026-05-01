import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { products } from "@/lib/schema/products";

const BASE_URL = "https://freemanfirewood.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeProducts = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.isActive, true));

  const productUrls: MetadataRoute.Sitemap = activeProducts.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/delivery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faqs`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    ...productUrls,
  ];
}
