"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] =useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuthStore();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(
        form.email,
        form.password
      );

      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
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
            onClick={() => router.push("/")}
            className="text-white/60 hover:text-white transition cursor-pointer"
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

            <div className="relative">
  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    required
    className="w-full bg-black text-white border border-white/10 rounded-lg p-3 pr-12 outline-none"
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
  >
    {showPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}
  </button>
</div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <div className="text-center">
                <p className="text-red-500">
                  {error}
                </p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Don't have an account?
            </p>

            <button
              onClick={() => router.push("/register")}
              className="mt-2 text-black py-3 rounded-lg bg-white w-1/2 hover:bg-gray-300 cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}