import Link from "next/link";

export default function DeliveryPage() {
  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-brown mb-8">Delivery</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-brand-brown mb-3">Coverage Area</h2>
          <p className="text-brand-brown/80 mb-4">
            We deliver throughout the following postcode areas:
          </p>
          <ul className="list-disc list-inside space-y-1 text-brand-brown/80 mb-4">
            <li>
              <strong>HR</strong> — Herefordshire
            </li>
            <li>
              <strong>GL</strong> — Gloucestershire
            </li>
            <li>
              <strong>WR</strong> — Worcestershire
            </li>
          </ul>
          {/* TODO(freeman): confirm full list of covered postcode prefixes */}
          <p className="text-brand-brown/80">
            If your postcode is on the border of our area, please{" "}
            <Link href="/contact" className="text-brand-orange hover:underline">
              contact us
            </Link>{" "}
            to confirm coverage before ordering.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-brand-brown mb-3">Lead Times</h2>
          {/* TODO(freeman): verify actual lead times */}
          <p className="text-brand-brown/80">
            Orders are typically delivered within 3–5 working days. We will contact you to
            arrange a suitable delivery window.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-brand-brown mb-3">How We Deliver</h2>
          <p className="text-brand-brown/80 mb-2">
            Logs are delivered in 0.9m³ bags via a vehicle fitted with a crane or grab. We
            will place bags as close to your storage area as our vehicle can safely reach.
          </p>
          <p className="text-brand-brown/80">
            Please ensure clear vehicle access is available on the day of delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-brown mb-3">Delivery Cost</h2>
          {/* TODO(freeman): confirm delivery pricing structure */}
          <p className="text-brand-brown/80">
            Delivery cost is calculated at checkout based on your postcode. Visit our{" "}
            <Link href="/products" className="text-brand-orange hover:underline">
              products page
            </Link>{" "}
            to browse and order.
          </p>
        </section>
      </div>
    </main>
  );
}
