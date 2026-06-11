import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useSkillStore = create((set) => ({
  skills: [],
  loading: false,

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