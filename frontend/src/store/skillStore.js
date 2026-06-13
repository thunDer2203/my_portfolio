import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useSkillStore = create((set) => ({
  skills: [],
  loading: false,

  securedFetchSkills: async (
    options = {}
  ) => {
    const res = await fetch(
      `${BASE}/skills/secure`,
      {
        credentials: "include",
        ...options,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Request failed"
      );
    }

    return data.skills || [];
  },

  fetchSkills: async (username = null) => {
    try {
      set({ loading: true });

      const endpoint = username
        ? `${BASE}/skills/${username}`
        : `${BASE}/skills`;

      const res = await fetch(endpoint);
      const data = await res.json();

      set({
        skills: data.skills || [],
        loading: false,
      });
    } catch (error) {
      console.error(error);

      set({
        loading: false,
      });
    }
  },
}));