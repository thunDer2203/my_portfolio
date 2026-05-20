"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const TEAM = [
  { name:"Priya Sharma", role:"Co-founder & CEO",                  initials:"PS", bg:"#E5D0B5", tc:"#6E4420",
    bio:"Former textile designer who spent a decade documenting craft traditions across Rajasthan before starting Mharo." },
  { name:"Arjun Mehta",  role:"Co-founder & Head of Partnerships", initials:"AM", bg:"#DDE8D1", tc:"#3B6D11",
    bio:"Supply chain specialist passionate about building direct, fair relationships between makers and markets." },
  { name:"Kavya Nair",   role:"Head of Design",                    initials:"KN", bg:"#FAECE7", tc:"#993C1D",
    bio:"Product designer who believes every object in your home should earn its place through beauty and function." },
];

const TIMELINE = [
  { year:"2019", event:"Priya and Arjun meet at a craft fair in Jaipur. The idea for Mharo is born over chai." },
  { year:"2020", event:"First 10 artisan partners onboarded. Launch with 120 products across 3 categories." },
  { year:"2021", event:"Crossed 5,000 orders. Expanded to textiles and natural skincare." },
  { year:"2022", event:"Kavya joins as Head of Design. New brand identity and website launched." },
  { year:"2023", event:"15,000+ happy customers across India. 50+ artisan partners in 8 states." },
  { year:"2025", event:"Launching international shipping to bring Indian craft to the world." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar user={null} onLogout={() => {}} onOpenAuth={() => {}} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#FDF8F2] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-earth-100/50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-4">Our story</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-bark mb-6 leading-tight">
            Rooted in craft,<br />growing with purpose.
          </h1>
          <p className="text-bark/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Mharo was born from a simple belief — the products we bring into our homes
            should be beautiful, honest, and made to last.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-center">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden h-64 bg-earth-100">
            <img src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=400&q=80" alt="Artisan at work" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden h-64 mt-8 bg-sage-100">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" alt="Products" className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-3">How it began</p>
          <h2 className="font-display text-3xl font-bold text-bark mb-5">A craft fair in Jaipur changed everything</h2>
          <p className="text-bark/70 leading-relaxed mb-4">
            In the foothills of Rajasthan, our founders watched generations of artisans
            create extraordinary things with their hands — only to see their work go unnoticed
            by the wider world. Mharo was created to change that.
          </p>
          <p className="text-bark/70 leading-relaxed mb-4">
            We partner directly with craftspeople and small workshops, ensuring fair wages
            and genuine recognition for their art. Every product carries a story — of the
            hands that shaped it, the land it came from, and the tradition it honours.
          </p>
          <p className="text-bark/70 leading-relaxed">
            Today, Mharo works with over 50 artisans across India, bringing their craft
            to homes that appreciate quality and authenticity.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-earth-800 text-cream py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number:"50+",   label:"Artisan partners" },
            { number:"1200+", label:"Products listed" },
            { number:"15k+",  label:"Happy customers" },
            { number:"8",     label:"States represented" },
          ].map(({ number, label }) => (
            <div key={label}>
              <p className="font-display text-4xl font-bold text-earth-300 mb-1">{number}</p>
              <p className="text-cream/60 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-2 text-center">Our journey</p>
        <h2 className="font-display text-3xl font-bold text-bark text-center mb-12">Six years in the making</h2>
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-px bg-earth-200" />
          <div className="space-y-8">
            {TIMELINE.map(({ year, event }) => (
              <div key={year} className="flex gap-8 items-start">
                <div className="w-12 text-right shrink-0">
                  <span className="font-display font-bold text-earth-500 text-sm">{year}</span>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-earth-400 border-2 border-[#FDF8F2] -translate-x-1.5" />
                  <p className="text-bark/70 text-sm leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-earth-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-2 text-center">What we stand for</p>
          <h2 className="font-display text-3xl font-bold text-bark text-center mb-12">Our values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:"🌿", title:"Natural first",    desc:"Every material is responsibly sourced. No synthetics, no shortcuts." },
              { icon:"🤝", title:"Fair trade",        desc:"Artisans earn what they deserve — always above market rate." },
              { icon:"🌍", title:"Planet-conscious",  desc:"Minimal packaging, biodegradable materials, carbon-offset shipping." },
              { icon:"💛", title:"Community",         desc:"We reinvest in artisan communities through training and infrastructure." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-earth-100 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-bark mb-2 text-sm">{title}</h3>
                <p className="text-bark/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-2 text-center">The humans</p>
        <h2 className="font-display text-3xl font-bold text-bark text-center mb-12">The people behind Mharo</h2>
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {TEAM.map(({ name, role, initials, bg, tc, bio }) => (
            <div key={name} className="text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-earth-100 text-2xl font-display font-bold"
                style={{ background: bg, color: tc }}>
                {initials}
              </div>
              <p className="font-display text-lg font-semibold text-bark">{name}</p>
              <p className="text-earth-500 text-xs mb-3">{role}</p>
              <p className="text-bark/60 text-sm leading-relaxed">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-earth-700 text-cream px-10 py-16 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Want to work with us?</h2>
          <p className="text-cream/70 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Are you an artisan or know someone whose craft deserves a wider audience?
            We&apos;d love to hear from you.
          </p>
          <a href="/contact" className="inline-block px-8 py-3 rounded-full bg-cream text-bark font-semibold hover:bg-earth-100 transition">
            Get in touch
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}