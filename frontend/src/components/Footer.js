import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bark text-cream/80 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <p className="font-display text-3xl font-bold text-cream mb-3">Mharo</p>
          <p className="text-sm leading-relaxed text-cream/60">
            Handcrafted goods rooted in tradition, designed for the modern home.
            Every product tells a story of skilled artisans and natural materials.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-earth-300 mb-4">
            Navigate
          </p>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/",        label: "Home" },
              { href: "/about",   label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/search",  label: "Search Products" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-earth-300 transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact snippet */}
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-earth-300 mb-4">
            Get in touch
          </p>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>hello@mharo.in</li>
            <li>+91 98765 43210</li>
            <li>Mon – Sat, 10 am – 6 pm IST</li>
          </ul>
          <div className="flex gap-4 mt-5">
            {["instagram", "twitter", "facebook"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-cream/40 hover:text-earth-300 capitalize text-xs transition"
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-4 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-cream/30">
        <span>© {new Date().getFullYear()} Mharo. All rights reserved.</span>
        <span>Made with care in India</span>
      </div>
    </footer>
  );
}
