import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useAboutStore = create((set) => ({
  about: null,
  loading: false,

  fetchAbout: async () => {
    try {
      set({ loading: true });

      const res = await fetch(`${BASE}/about`);
      const data = await res.json();

      set({
        about: data.about,
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