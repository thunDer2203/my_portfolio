"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCarousel from "../components/ProductCarousel";
import AuthModal from "../components/AuthModal";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [user,       setUser]       = useState(null);
  const [authModal,  setAuthModal]  = useState(null); // "login" | "register" | null
  const [cartCount,  setCartCount]  = useState(0);
  const [toast,      setToast]      = useState(null);

  // Load products on mount
  // console.log("Component mounted, BASE =", BASE);
  useEffect(() => {
    console.log("Fetching products...");
    fetch(`${BASE}/cart`, { credentials: "include" })
      .then(r => { return r.json(); })
      .then(d => { setCartCount(Array.isArray(d.cart.items) ? d.cart.items.length : 0);})
      .catch(() => setCartCount(0))
      .finally(() => setLoading(false));
    fetch(`${BASE}/products`, { credentials: "include" })
      .then(r => {console.log(r); return r.json(); })
      .then(d => {console.log(d); setProducts(Array.isArray(d) ? d : d.products ?? []);})
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    fetch(`${BASE}/auth/check`, {method: "POST", credentials: "include" })
    .then(r => r.json())
    .then(d => {
      console.log("Auth check:", d);
      if (d.user) setUser({ name: d.user });
    })
    .catch(() => {})
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAuthSuccess(data) {
    // Backend may return user inside data.user or at top level
    console.log(data);
    const u = data.user || data;
    setUser(u);
    setAuthModal(null);
    showToast(`Welcome, ${u.name}!`);
  }

  async function handleLogout() {
    try {
      await fetch(`${BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    setCartCount(0);
    showToast("Logged out successfully");
  }

  async function handleAddToCart(productId) {
    if (!user) {
      setAuthModal("login");
      showToast("Please sign in to add items to cart", "warn");
      return;
    }
    try {
      const res = await fetch(`${BASE}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: [{ productId, quantity: 1 }] }),
      });
      if (res.ok) {
        setCartCount(c => c + 1);
        showToast("Added to cart!");
      } else {
        const d = await res.json();
        showToast(d.message || "Could not add to cart", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  }

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAuth={setAuthModal}
      />

      {/* Auth modal */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-full text-sm font-medium shadow-lg transition-all ${
          toast.type === "error"   ? "bg-red-600 text-white" :
          toast.type === "warn"    ? "bg-earth-500 text-cream" :
                                     "bg-earth-800 text-cream"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Cart pill */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-earth-700 text-cream px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount} item{cartCount !== 1 ? "s" : ""}
        </div>
      )}

      {/* ── Hero ─────────────────────────────────── */}
      <section className="min-h-[92vh] flex flex-col justify-center pt-16 bg-[#FDF8F2] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-earth-100/60 pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-sage-100/40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-fade-up">
            <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-4">Handcrafted with love</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-bark leading-[1.05] mb-6">
              Natural.<br />Timeless.<br />
              <span className="text-earth-600">Yours.</span>
            </h1>
            <p className="text-bark/60 text-lg leading-relaxed max-w-md mb-8">
              Discover a curated collection of artisan products crafted from
              earth&apos;s finest materials — brought to your doorstep.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#products" className="px-6 py-3 rounded-full bg-earth-700 text-cream font-medium hover:bg-earth-800 transition">
                Shop now
              </a>
              {!user ? (
                <button onClick={() => setAuthModal("register")} className="px-6 py-3 rounded-full border border-earth-300 text-bark font-medium hover:bg-amber-800 cursor-pointer transition">
                  Create account
                </button>
              ) : (
                <Link href="/about" className="px-6 py-3 rounded-full border border-earth-300 text-bark font-medium hover:bg-amber-800 cursor-pointer transition">
                  Our story
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay:"0.2s" }}>
            <div className="rounded-2xl overflow-hidden h-72 bg-earth-200">
              <img src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=400&q=80" alt="Artisan crafts" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-72 mt-8 bg-sage-200">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" alt="Natural products" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────── */}
      <section className="bg-earth-800 text-cream py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-sm font-medium text-cream/70">
          {["Free shipping above ₹999","100% natural materials","Artisan-made","Easy returns"].map(t => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-earth-300" />{t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Products carousel ────────────────────── */}
      <section id="products" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-2">Our collection</p>
            <h2 className="font-display text-4xl font-bold text-bark">Featured products</h2>
          </div>
          <Link href="/search" className="text-sm text-earth-600 hover:text-earth-800 font-medium underline underline-offset-4">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {/* {console.log("Loading products...")} */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-64 h-80 rounded-2xl bg-earth-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
          <ProductCarousel products={products} onAddToCart={handleAddToCart} />
          {console.log(products)}
          </div>
        )}
      </section>

      {/* ── Values ───────────────────────────────── */}
      <section className="bg-earth-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-bark text-center mb-14">Why Mharo?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon:"🌿", title:"All-natural",   desc:"Every ingredient and material is responsibly sourced from nature — no synthetics." },
              { icon:"🤝", title:"Artisan-made",  desc:"Supporting skilled craftspeople who pour their heritage into every product." },
              { icon:"🌍", title:"Sustainable",   desc:"Minimal packaging, carbon-conscious shipping, and a commitment to the planet." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-earth-100 text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display text-xl font-semibold text-bark mb-2">{title}</h3>
                <p className="text-bark/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sign-up CTA (only shown when logged out) ─ */}
      {!user && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="rounded-3xl bg-earth-700 text-cream px-10 py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_70%_50%,#fff,transparent)]" />
            <h2 className="font-display text-4xl font-bold mb-4 relative z-10">
              Join the Mharo community
            </h2>
            <p className="text-cream/70 mb-8 relative z-10 max-w-md mx-auto">
              Create a free account to save your cart, track orders, and get early access to new arrivals.
            </p>
            <div className="flex gap-4 justify-center relative z-10">
              <button onClick={() => setAuthModal("register")} className="px-8 py-3 rounded-full bg-cream text-bark font-semibold hover:bg-earth-100 transition">
                Create free account
              </button>
              <button onClick={() => setAuthModal("login")} className="px-8 py-3 rounded-full border border-cream/40 text-cream font-medium hover:bg-earth-800 transition">
                Sign in
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
