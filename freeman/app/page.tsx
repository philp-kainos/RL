import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="bg-brand-brown text-brand-cream py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Premium Firewood, Delivered to Your Door
          </h1>
          <p className="text-lg sm:text-xl text-brand-cream-dark mb-8 max-w-2xl mx-auto">
            Kiln-dried hardwood logs and woodchip for homes and businesses across
            Herefordshire, Gloucestershire and Worcestershire.
          </p>
          <Link
            href="/products"
            className="inline-block bg-brand-orange hover:bg-brand-orange-light text-brand-cream font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="bg-brand-cream py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-brand-brown text-center mb-10">
            Why Choose Freeman Firewood?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-brand-brown text-lg mb-2">Kiln Dried</h3>
              <p className="text-brand-brown/80 text-sm">
                Our logs are kiln-dried to below 20% moisture, so they light easily and
                burn efficiently with less smoke.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-brand-brown text-lg mb-2">Local Delivery</h3>
              <p className="text-brand-brown/80 text-sm">
                We deliver throughout HR, GL and WR postcode areas, straight to your
                door or storage area.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-brand-brown text-lg mb-2">Sustainably Sourced</h3>
              <p className="text-brand-brown/80 text-sm">
                Hardwood sourced from responsibly managed woodland in the West Midlands
                and Welsh Borders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-brown-light text-brand-cream py-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to order?</h2>
          <p className="text-brand-cream-dark mb-6">
            Browse our products or find out more about our delivery coverage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-brand-orange hover:bg-brand-orange-light text-brand-cream font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Products
            </Link>
            <Link
              href="/delivery"
              className="border border-brand-cream-dark text-brand-cream hover:bg-brand-cream/10 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Delivery Info
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
