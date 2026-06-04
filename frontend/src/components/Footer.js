import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-[#040814] text-white overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4af 1px,transparent 1px),linear-gradient(90deg,#4af 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-14">
        {/* Brand */}
        <div>
          <p
            className="font-mono text-3xl font-bold mb-4"
            style={{
              background:
                "linear-gradient(135deg, #67e8f9 0%, #3b82f6 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Shubham.dev
          </p>

          <p className="text-sm leading-relaxed text-white/45 max-w-sm">
            Full-stack engineer crafting scalable web experiences with
            performance-first architecture, clean UI systems, and modern cloud
            infrastructure.
          </p>

          <div className="mt-6 flex items-center gap-2 font-mono text-xs text-cyan-400/70">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Available for freelance & contract work
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400/70 mb-5">
            Navigation
          </p>

          <ul className="space-y-3 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "#skills", label: "Skills" },
              { href: "#projects", label: "Projects" },
              { href: "/search", label: "Explore Stack" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/45 hover:text-cyan-300 transition duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400/70 mb-5">
            Connect
          </p>

          <ul className="space-y-3 text-sm text-white/45">
            <li>hello@shubham.dev</li>
            <li>Based in India (IST)</li>
            <li>Open Mon – Sat · 10am – 8pm</li>
          </ul>

          <div className="flex gap-5 mt-6">
            {[
              { label: "GitHub", href: "#" },
              { label: "LinkedIn", href: "#" },
              { label: "Twitter", href: "#" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-white/35 hover:text-cyan-300 transition"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white/25">
          <span>
            © {new Date().getFullYear()} Shubham.dev — All rights reserved.
          </span>

          <span className="text-cyan-400/40">
            Built with Next.js, Tailwind & caffeine ☕
          </span>
        </div>
      </div>
    </footer>
  );
}

