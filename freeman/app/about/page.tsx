import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-brown mb-6">About Freeman Firewood</h1>

        <div className="space-y-6 text-brand-brown/80">
          <p>
            {/* TODO(freeman): verify founding year and company history */}
            Freeman Firewood is a family-run business supplying premium kiln-dried logs and
            woodchip to homes and businesses across Herefordshire, Gloucestershire, and
            Worcestershire.
          </p>

          <p>
            We take pride in delivering firewood that is ready to burn. All our hardwood logs
            are kiln-dried to below 20% moisture content, ensuring a clean, efficient, and
            satisfying fire every time.
          </p>

          <h2 className="text-xl font-semibold text-brand-brown pt-2">Our Products</h2>
          <p>
            We supply kiln-dried hardwood logs in 0.9m³ bags — available in both 8-inch and
            10-inch lengths to suit different stoves and fireplaces. We also supply force-dried
            woodchip for larger users; pricing available on application.
          </p>

          <h2 className="text-xl font-semibold text-brand-brown pt-2">Our Commitment</h2>
          <p>
            All timber is sourced from responsibly managed woodland in the West Midlands and
            Welsh Borders. We are committed to sustainable forestry practices and minimising our
            environmental footprint.
          </p>

          <p>
            {/* TODO(freeman): verify exact location / address */}
            We are based in Herefordshire and deliver throughout our local area. If you are
            unsure whether we cover your postcode, please{" "}
            <Link href="/contact" className="text-brand-orange hover:underline">
              get in touch
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
