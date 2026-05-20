"use client";
import { useRef, useState } from "react";
import Image from "next/image";

const FALLBACK = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80";

function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const price = typeof product.price === "number"
    ? product.price.toLocaleString("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 })
    : product.price ?? "—";

  async function handleAdd() {
    await onAddToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="product-card shrink-0 w-64 rounded-2xl overflow-hidden bg-white border border-earth-100">
      <div className="relative h-52 w-full bg-earth-50">
        <Image
          src={product.image || product.imageUrl || product.img || FALLBACK}
          alt={product.name || product.title || "Product"}
          fill className="object-cover" sizes="256px"
          onError={e => { e.currentTarget.src = FALLBACK; }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-earth-500 bg-white px-3 py-1 rounded-full border border-earth-200">Out of stock</span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-earth-600 text-cream text-xs font-semibold px-2 py-1 rounded-full">{product.badge}</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-earth-400 uppercase tracking-widest font-medium mb-1">{product.category || "Product"}</p>
        <h3 className="font-display text-base font-semibold text-bark leading-snug mb-1 line-clamp-2">{product.name || product.title || "Unnamed"}</h3>
        {product.stock != null && (
          <p className="text-xs text-earth-400 mb-2">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-earth-700 font-semibold text-lg">{price}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${added ? "bg-sage-500 border-sage-500 text-white" : "border-earth-300 text-earth-700 hover:bg-earth-600 hover:text-cream hover:border-earth-600"} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {added ? "✓ Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCarousel({ products = [], onAddToCart }) {
  const ref = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  function scroll(dir) {
    ref.current?.scrollBy({ left: dir * 288, behavior: "smooth" });
  }
  function onScroll() {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  if (!products.length) return (
    <div className="py-16 text-center text-earth-300">No products available right now.</div>
  );

  return (
    <div className="relative">
      {canLeft && (
        <button onClick={() => scroll(-1)} aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-earth-200 shadow flex items-center justify-center text-earth-600 hover:bg-earth-50 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="m15 18-6-6 6-6"/></svg>
        </button>
      )}
      <div ref={ref} onScroll={onScroll} className="flex gap-5 overflow-x-auto hide-scroll pb-4 px-1">
        {products.map((p, i) => (
          <ProductCard key={p.id ?? i} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
      {canRight && (
        <button onClick={() => scroll(1)} aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-earth-200 shadow flex items-center justify-center text-earth-600 hover:bg-earth-50 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6"/></svg>
        </button>
      )}
    </div>
  );
}
