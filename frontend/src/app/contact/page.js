"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ContactPage() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // "sending" | "success" | "error"

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-16 bg-[#FDF8F2]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-earth-500 font-semibold mb-4">
            We&apos;d love to hear from you
          </p>
          <h1 className="font-display text-5xl font-bold text-bark mb-4">Contact us</h1>
          <p className="text-bark/60 leading-relaxed max-w-xl mx-auto">
            Questions, feedback, wholesale enquiries — drop us a message and
            we&apos;ll get back within 24 hours.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16 items-start">
        {/* Info panel */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-bark mb-6">
              Reach us directly
            </h2>
            {[
              { label: "Email", value: "hello@mharo.in" },
              { label: "Phone", value: "+91 98765 43210" },
              { label: "Hours", value: "Mon – Sat, 10 am – 6 pm IST" },
              { label: "Address", value: "12 Artisan Lane, Jaipur, Rajasthan 302001" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 py-3 border-b border-earth-100 last:border-0">
                <span className="text-xs uppercase tracking-widest text-earth-400 font-semibold w-16 mt-0.5">
                  {label}
                </span>
                <span className="text-bark/80 text-sm">{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden h-52">
            <img
              src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=700&q=80"
              alt="Our store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-2">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-2">
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell us anything…"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition resize-none"
            />
          </div>

          {status === "success" && (
            <p className="text-sage-600 text-sm font-medium bg-sage-50 px-4 py-3 rounded-xl">
              ✓ Message sent! We&apos;ll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">
              Something went wrong. Please try again or email us directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-3 rounded-xl bg-earth-700 text-cream font-semibold hover:bg-earth-800 disabled:opacity-60 transition"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
}
