"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function Navbar({ onOpenAuth }) {
  const [open,     setOpen]     = useState(false);
  const [query,    setQuery]    = useState("");
  const [scrolled, setScrolled] = useState(false);

  const router   = useRouter();
  const pathname = usePathname();

  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/",        label: "Home"     },
    { href: "#skills",  label: "Skills"   },
    { href: "#projects",label: "Projects" },
    { href: "/contact", label: "Contact"  },
  ];

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setOpen(false);
  }

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060C1A]/90 backdrop-blur-md border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* LOGO */}
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight shrink-0 flex items-center gap-2"
        >
          <span
            style={{
              background: "linear-gradient(135deg, #67e8f9, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            &lt;Shubham /&gt;
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                pathname === href
                  ? "text-cyan-400"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-xs"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills…"
              className="w-full pl-4 pr-10 py-2 text-xs font-mono rounded-full border border-white/10 bg-white/5 text-white/70 placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:bg-white/8 transition"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-cyan-400 transition"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="font-mono text-xs text-cyan-400/70 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {user ? user : "User"}
              </span>
              <button
                onClick={handleLogout}
                className="cursor-pointer font-mono text-xs px-4 py-1.5 rounded-full border border-white/10 text-white/50 hover:border-white/30 hover:text-white/90 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={() => onOpenAuth("login")}
              className="cursor-pointer font-mono text-xs px-5 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 transition"
            >
              Sign in
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 text-white/50 hover:text-white/90 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-[#060C1A]/95 backdrop-blur-md border-t border-white/[0.06] px-6 pb-6 pt-4 space-y-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block font-mono text-xs uppercase tracking-widest text-white/40 hover:text-cyan-300 py-1 transition"
            >
              {label}
            </Link>
          ))}

          {/* MOBILE SEARCH */}
          <form onSubmit={handleSearch} className="flex gap-2 pt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills…"
              className="flex-1 px-4 py-2 text-xs font-mono rounded-full border border-white/10 bg-white/5 text-white/70 placeholder-white/20 focus:outline-none focus:border-cyan-400/40"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 font-mono text-xs"
            >
              Go
            </button>
          </form>

          {/* MOBILE AUTH */}
          {!user ? (
            <button
              onClick={() => { onOpenAuth("login"); setOpen(false); }}
              className="w-full py-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 font-mono text-xs"
            >
              Sign in
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-full border border-white/10 text-white/50 font-mono text-xs"
            >
              Log out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}