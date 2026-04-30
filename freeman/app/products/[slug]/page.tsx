import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { products } from "@/lib/schema/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));

  if (!product) {
    notFound();
  }

  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold text-brand-brown">{product.name}</h1>
        <p className="mb-6 text-brand-brown-light">{product.description}</p>
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-brown-light">{product.unitLabel}</span>
          <span className="text-2xl font-bold text-brand-brown">
            {product.isPoa ? "POA" : `£${(product.pricePence / 100).toFixed(2)}`}
          </span>
        </div>
      </div>
    </main>
  );
}
