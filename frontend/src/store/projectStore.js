import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    try {
      set({ loading: true });

      const res = await fetch(`${BASE}/projects`);
      const data = await res.json();

      set({
        projects: data.projects || [],
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