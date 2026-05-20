"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ user, onLogout, onOpenAuth }) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/",        label: "Home" },
    { href: "/about",   label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(""); setOpen(false);
    }
  }

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#FDF8F2]/95 backdrop-blur shadow-sm border-b border-earth-100" : "bg-[#FDF8F2]"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl font-bold text-earth-800 tracking-tight shrink-0">Mharo</Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={`text-sm font-medium transition-colors ${pathname === href ? "text-earth-700 border-b-2 border-earth-500 pb-0.5" : "text-bark/70 hover:text-earth-700"}`}>{label}</Link>
          ))}
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs">
          <div className="relative w-full">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…"
              className="w-full pl-4 pr-10 py-2 text-sm rounded-full border border-earth-200 bg-earth-50 text-bark placeholder-earth-300 focus:outline-none focus:border-earth-400 transition" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-700" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </div>
        </form>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-bark/70 font-medium">Hi, {user.username}</span>
              <button onClick={onLogout} className="text-sm px-4 py-1.5 rounded-full border border-earth-300 text-earth-700 hover:bg-earth-50 transition">Log out</button>
            </>
          ) : (
            <button onClick={() => onOpenAuth("login")} className="text-sm px-4 py-1.5 rounded-full bg-earth-700 text-cream hover:bg-earth-800 transition">Sign in</button>
          )}
        </div>

        <button className="md:hidden p-2 text-bark" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#FDF8F2] border-t border-earth-100 px-6 pb-5 pt-3 space-y-3">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="block text-bark/80 font-medium py-1 hover:text-earth-700">{label}</Link>
          ))}
          <form onSubmit={handleSearch} className="flex gap-2 pt-2">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
              className="flex-1 px-4 py-2 text-sm rounded-full border border-earth-200 bg-earth-50 focus:outline-none focus:border-earth-400" />
            <button type="submit" className="px-4 py-2 rounded-full bg-earth-600 text-cream text-sm font-medium">Go</button>
          </form>
          {!user && <button onClick={() => { onOpenAuth("login"); setOpen(false); }} className="w-full py-2 rounded-full bg-earth-700 text-cream text-sm font-medium">Sign in</button>}
        </div>
      )}
    </nav>
  );
}
