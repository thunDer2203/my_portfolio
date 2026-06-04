import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useExperienceStore = create((set) => ({
  experience: [],
  loading: false,
  fetchExperience: async () => {
    try {
      set({ loading: true });

      const res = await fetch(`${BASE}/experience`);
      const data = await res.json();
        console.log(data.experiences);
      set({
        experience: data.experiences || [],
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