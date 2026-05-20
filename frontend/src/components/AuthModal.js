"use client";
import { useState } from "react";

export default function AuthModal({ mode, onClose, onSuccess }) {
  const [tab, setTab]       = useState(mode); // "login" | "register"
  const [form, setForm]     = useState({ username:"", email:"", password:"", phone:"" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  function handle(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const url  = tab === "login" ? `${BASE}/auth/login` : `${BASE}/auth/register`;
      const body = tab === "login"
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password, phone: form.phone };
      const res  = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include", body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong"); setLoading(false); return; }
      onSuccess(data);
    } catch { setError("Network error. Is your backend running?"); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{background:"rgba(61,43,31,0.5)"}}>
      <div className="bg-[#FDF8F2] rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-earth-400 hover:text-bark" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        <p className="font-display text-2xl font-bold text-bark mb-1">
          {tab === "login" ? "Welcome back" : "Create account"}
        </p>
        <p className="text-sm text-earth-400 mb-6">
          {tab === "login" ? "Sign in to your Mharo account" : "Join the Mharo community"}
        </p>

        {/* Tab toggle */}
        <div className="flex rounded-full bg-earth-100 p-1 mb-6">
          {["login","register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} className={`flex-1 text-sm py-1.5 rounded-full font-medium transition ${tab===t ? "bg-earth-700 text-cream" : "text-earth-600 hover:text-bark"}`}>
              {t === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {tab === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">Username</label>
                <input name="username" value={form.username} onChange={handle} required placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="10-digit number"
                  className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm" />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} required placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm" />
          </div>

          {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-earth-700 text-cream font-semibold hover:bg-earth-800 disabled:opacity-60 transition mt-2">
            {loading ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
