"use client";

import { useState,useEffect } from "react";
import LoginPage from "./LoginPage";
import { useAuthStore } from "../store/authStore";
import DashboardPage from "./DashBoard";
// import { useEffect, useState } from "react";
// import { useAuthStore } from "@/store/authStore";



export default function RegisterPage({onReturn}) {




  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    title: "",
  });

const [showLogin, setShowLogin] = useState(false);
const [loading, setLoading] = useState(false);
const [checkingAuth, setCheckingAuth] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
const { register } = useAuthStore();
const { user, checkAuth } = useAuthStore();
const [error, setError] = useState("");


useEffect(() => {
    const verifyUser = async () => {
      if (user) {
        setShowDashboard(true);
        setCheckingAuth(false);
        return;
      }

      await checkAuth();

      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        setShowDashboard(true);
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

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return ;
  }

  try {
    setLoading(true);

    const data = await register({
      name: form.name.toLowerCase(),
      username: form.username.toLowerCase(),
      email: form.email,
      password: form.password,
      title: form.title,
    });

    setShowDashboard(true);

    onReturn();
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

if (showDashboard) {
  return (
    <DashboardPage/>
  );
}


if (showLogin) {
  return (
    <LoginPage
      onReturn={() => setShowLogin(false)}
      onLoginSuccess={() => {
        setShowLogin(false);
        setShowDashboard(true);
      }}
    />
  );
}

  if(!showLogin && !showDashboard){
    return(
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
            className="w-full py-3 rounded-lg bg-white text-black font-semibold cursor-pointer hover:bg-gray-300 transition disabled:cursor-not-allowed disabled:bg-white/50"
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
    onClick={() => setShowLogin(true)}
    className="mt-2 text-black underline cursor-pointer py-3 rounded-lg bg-white w-1/2 hover:bg-gray-300"
  >
    Login
  </button>
</div>
<div>
    {error && (
      <p className="text-red-500 mt-4 text-center">
        {error}
      </p>
    )}
</div>
      </div>
    </section>
  );
}
}