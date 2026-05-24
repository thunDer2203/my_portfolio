"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthModal({
  mode,
  onClose,
  onSuccess,
  orderId, // pass order id when mode === "payment"
}) {
  const router = useRouter();

  const [tab, setTab] = useState(mode); // "login" | "register" | "payment"
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  function handle(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const url =
        tab === "login"
          ? `${BASE}/auth/login`
          : `${BASE}/auth/register`;

      const body =
        tab === "login"
          ? {
              email: form.email,
              password: form.password,
            }
          : {
              username: form.username,
              email: form.email,
              password: form.password,
              phone: form.phone,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      console.log("Auth data:", data);

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      onSuccess(data);
    } catch {
      setError("Network error.");
    }

    setLoading(false);
  }

  // PAYMENT MODE UI
  if (tab === "payment") {
    return (
      // console.log("Payment verify response:"),
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: "rgba(61,43,31,0.5)" }}
      >
        <div className="bg-[#FDF8F2] rounded-3xl w-full max-w-sm p-8 shadow-2xl relative text-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-earth-400 hover:text-bark"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-bark mb-2">
            Payment Successful
          </h2>

          <p className="text-earth-500 text-sm mb-2">
            Your order has been placed successfully.
          </p>

          <div className="bg-earth-100 rounded-xl py-3 px-4 mb-6">
            <p className="text-xs uppercase tracking-widest text-earth-500 mb-1">
              Order ID
            </p>

            <p className="font-semibold text-bark break-all">
              {orderId || "N/A"}
            </p>
          </div>

          <button
            onClick={() => {
              onClose?.();
              router.push("/");
            }}
            className="w-full py-3 rounded-xl bg-earth-700 text-cream font-semibold hover:bg-amber-900 transition cursor-pointer"
          >
            Okay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(61,43,31,0.5)" }}
    >
      <div className="bg-[#FDF8F2] rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-earth-400 hover:text-bark"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <p className="font-display text-2xl font-bold text-bark mb-1">
          {tab === "login" ? "Welcome back" : "Create account"}
        </p>

        <p className="text-sm text-earth-400 mb-6">
          {tab === "login"
            ? "Sign in to your Mharo account"
            : "Join the Mharo community"}
        </p>

        {/* Tab toggle */}
        <div className="flex rounded-full bg-earth-100 p-1 mb-6">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError("");
              }}
              className={`flex-1 text-sm py-1.5 rounded-full font-medium transition hover:bg-amber-900 cursor-pointer ${
                tab === t
                  ? "bg-amber-800 text-cream"
                  : "text-earth-600 hover:text-bark"
              }`}
            >
              {t === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {tab === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">
                  Username
                </label>

                <input
                  name="username"
                  value={form.username}
                  onChange={handle}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">
                  Phone
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handle}
                  placeholder="10-digit number"
                  className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              required
              placeholder="you@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-earth-600 uppercase tracking-widest mb-1.5">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handle}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-white text-bark placeholder-earth-300 focus:outline-none focus:border-earth-500 transition text-sm"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-earth-700 text-cream font-semibold hover:bg-amber-100 disabled:opacity-60 transition mt-2 cursor-pointer"
          >
            {loading
              ? "Please wait…"
              : tab === "login"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}