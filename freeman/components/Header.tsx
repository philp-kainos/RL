import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-brand-brown text-brand-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Freeman Firewood
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <Link href="/products" className="hover:text-brand-orange-light transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="hover:text-brand-orange-light transition-colors">
                Delivery
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-orange-light transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-orange-light transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
