import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useSocialStore = create((set) => ({
  socials: [],
  loading: false,

  fetchSocials: async () => {
    try {
      set({ loading: true });

      const res = await fetch(`${BASE}/socials`);
      const data = await res.json();

      set({
        socials: data.socials || [],
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