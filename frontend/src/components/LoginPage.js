"use client";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function LoginPage({ onReturn,onLoginSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const { login } = useAuthStore();


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    await login(
      form.email,
      form.password
    );

    onLoginSuccess?.();
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white text-xl font-bold">
            Login
          </h2>

          <button
            onClick={onReturn}
            className="text-white/60 hover:text-white transition"
          >
            ← Back
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-black text-white border border-white/10 rounded-lg p-3 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-black text-white border border-white/10 rounded-lg p-3 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="mt-auto text-center">
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}