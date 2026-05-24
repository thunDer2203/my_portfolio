    import { create } from "zustand";

    const BASE = process.env.NEXT_PUBLIC_API_URL;

    export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),

    checkAuth: async () => {
        try {
        const res = await fetch(`${BASE}/auth/check`, {
            method: "POST",
            credentials: "include",
        });

        const data = await res.json();
        // console.log("Auth check:", data);
        if (data.name) {
            set({
            user: data.name,
            });
        } else {
            set({
            user: null,
            });
        }
        } catch {
        set({
            user: null,
        });
        } finally {
        set({
            loading: false,
        });
        }
    },

    login: async (email, password) => {
        const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            password,
        }),
        });

        const data = await res.json();

        if (!res.ok) {
        throw new Error(data.message || "Login failed");
        }

        set({
        user: data.user,
        });

        return data;
    },

    register: async (form) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  set({
    user: data.user,
  });

  return data;
},
    logout: async () => {
        try {
        await fetch(`${BASE}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        } catch {}

        set({
        user: null,
        });
    },
    }));