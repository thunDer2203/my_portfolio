import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useAboutStore = create((set) => ({
  about: null,
  loading: false,

  fetchAbout: async (username = null) => {
    try {
      set({ loading: true });
      // console.log("Fetching about for username:", username);
      const endpoint = username
        ? `${BASE}/about/${username}`
        : `${BASE}/about`;

      const res = await fetch(endpoint);
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