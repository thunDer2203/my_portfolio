"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    title: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] =
    useState(true);
  const [error, setError] = useState("");

  const { register, user, checkAuth } =
    useAuthStore();

  useEffect(() => {
    const verifyUser = async () => {
      if (user) {
        router.replace("/dashboard");
        return;
      }

      await checkAuth();

      const currentUser =
        useAuthStore.getState().user;

      if (currentUser) {
        router.replace("/dashboard");
        return;
      }

      setCheckingAuth(false);
    };

    verifyUser();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      form.password !== form.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;

if (!usernameRegex.test(form.username)) {
  setError("Username can only contain letters, numbers, underscores and hyphens");
  return;
}

    try {
      setLoading(true);

      await register({
        name: form.name.toLowerCase(),
        username:
          form.username.toLowerCase(),
        email: form.email,
        password: form.password,
        title: form.title,
      });

      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">
          Create Your Portfolio
        </h1>

        <p className="text-white/60 mb-8">
          Generate your personal terminal
          portfolio.
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
            placeholder="Username (e.g. johndoe)"
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
            className="w-full py-3 rounded-lg bg-white text-black font-semibold cursor-pointer hover:bg-gray-300 transition disabled:bg-white/50"
          >
            {loading
              ? "Creating Portfolio..."
              : "Create Portfolio"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60">
            Already have an account?
          </p>

          <button
            onClick={() =>
              router.push("/login")
            }
            className="mt-2 text-black py-3 rounded-lg bg-white w-1/2 hover:bg-gray-300 cursor-pointer"
          >
            Login
          </button>
        </div>

        {error && (
          <p className="text-red-500 mt-4 text-center">
            {error}
          </p>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-white/60 hover:text-white"
          >
            ← Back to Terminal
          </button>
        </div>
      </div>
    </section>
  );
}