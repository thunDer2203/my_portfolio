"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    title: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            username: form.username,
            password: form.password,
            title: form.title,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(
        `Portfolio created!\n\nPortfolio URL:\n/${data.username}`
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">
          Create Your Portfolio
        </h1>

        <p className="text-white/60 mb-8">
          Generate your personal terminal portfolio.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/10 rounded-lg p-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/10 rounded-lg p-3"
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/10 rounded-lg p-3"
          />

          <input
            name="title"
            placeholder="Professional Title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-black border border-white/10 rounded-lg p-3"
          />

          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/10 rounded-lg p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/10 rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-white text-black font-semibold"
          >
            {loading
              ? "Creating Portfolio..."
              : "Create Portfolio"}
          </button>
        </form>
      </div>
    </section>
  );
}