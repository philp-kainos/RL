const faqs = [
  {
    q: "What does kiln-dried mean?",
    a: "Kiln-dried logs have been dried in a kiln to reduce their moisture content to below 20%. This makes them easier to light, burn hotter, produce less smoke, and cause less creosote build-up in your chimney or flue.",
  },
  {
    q: "What size logs do you sell?",
    a: 'We sell 0.9m³ bags in two log lengths: 8-inch and 10-inch. The right size depends on your stove or fireplace opening — check your appliance manual if you are unsure.',
  },
  {
    q: "How much do your products cost?",
    a: "Current pricing is shown on our products page. Woodchip is priced on application — please contact us for a quote.",
  },
  {
    q: "Do you deliver to my area?",
    a: "We deliver throughout HR (Herefordshire), GL (Gloucestershire) and WR (Worcestershire) postcode areas. Enter your postcode at checkout or contact us to confirm.",
  },
  {
    q: "How long will delivery take?",
    a: "Orders are typically fulfilled within 3–5 working days. We will call or email to agree a suitable delivery window.",
  },
  {
    q: "How should I store my logs?",
    a: "Store logs in a dry, well-ventilated place off the ground — a log store, shed, or garage is ideal. Avoid stacking directly against a wall, as this restricts airflow and can lead to moisture reabsorption.",
  },
  {
    q: "What is force-dried woodchip?",
    a: "Force-dried woodchip has been mechanically dried to reduce moisture and improve burning performance. It is typically used in biomass boilers. Pricing is on application — contact us for a quote.",
  },
  {
    q: "Can I pay by card?",
    a: "Yes. We accept major debit and credit cards via our secure online checkout.",
  },
];

export default function FaqsPage() {
  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-brown mb-8">
          Frequently Asked Questions
        </h1>
        <dl className="space-y-8">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-semibold text-brand-brown text-lg mb-1">{q}</dt>
              <dd className="text-brand-brown/80">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
