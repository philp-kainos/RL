export default function Footer() {
  return (
    <footer className="bg-brand-brown text-brand-cream mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold">Freeman Firewood</p>
          <p className="text-xs text-brand-cream-dark">
            &copy; {new Date().getFullYear()} Freeman Firewood. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
