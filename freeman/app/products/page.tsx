import { eq } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/lib/db";
import { products } from "@/lib/schema/products";

export default async function ProductsPage() {
  const activeProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true));

  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-brand-brown mb-8">Our Products</h1>
        {activeProducts.length === 0 ? (
          <p className="text-brand-brown-light">
            No products are currently available. Please check back soon.
          </p>
        ) : (
          <ul
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {activeProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.slug}`}
                  className="block rounded-lg border border-brand-cream-dark bg-brand-cream p-6 transition-shadow hover:shadow-md"
                >
                  <h2 className="mb-2 text-xl font-semibold text-brand-brown">
                    {product.name}
                  </h2>
                  <p className="mb-4 text-sm text-brand-brown-light">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-brown-light">
                      {product.unitLabel}
                    </span>
                    <span className="font-bold text-brand-brown">
                      {product.isPoa
                        ? "POA"
                        : `£${(product.pricePence / 100).toFixed(2)}`}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
