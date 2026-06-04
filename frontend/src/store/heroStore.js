import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useHeroStore = create((set) => ({
  hero: null,
  loading: false,

  fetchHero: async () => {
    try {
      set({ loading: true });

      const res = await fetch(`${BASE}/hero`);
      const data = await res.json();

      set({
        hero: data.hero,
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