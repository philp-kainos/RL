export default function ContactPage() {
  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-brown mb-6">Contact Us</h1>
        <p className="text-brand-brown/80 mb-8">
          Get in touch using the details below and we will get back to you as soon as possible.
        </p>

        <div className="grid sm:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-semibold text-brand-brown mb-3">Contact Details</h2>
            <ul className="space-y-2 text-brand-brown/80 text-sm">
              {/* TODO(freeman): replace with real phone number */}
              <li>
                <span className="font-medium">Phone:</span>{" "}
                <a href="tel:+441234567890" className="text-brand-orange hover:underline">
                  TODO(freeman): phone number
                </a>
              </li>
              {/* TODO(freeman): replace with real email address */}
              <li>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:info@freemanfirewood.co.uk"
                  className="text-brand-orange hover:underline"
                >
                  info@freemanfirewood.co.uk
                </a>
              </li>
              {/* TODO(freeman): replace with real address */}
              <li>
                <span className="font-medium">Address:</span>{" "}
                TODO(freeman): address
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-brand-brown mb-3">Opening Hours</h2>
            {/* TODO(freeman): verify actual opening hours */}
            <ul className="space-y-1 text-brand-brown/80 text-sm">
              <li>Monday – Friday: 8am – 5pm</li>
              <li>Saturday: 9am – 1pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
