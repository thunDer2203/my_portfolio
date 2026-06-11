import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,

  fetchProjects: async (username = null) => {
    try {
      set({ loading: true });

      const endpoint = username
        ? `${BASE}/projects/${username}`
        : `${BASE}/projects`;

      const res = await fetch(endpoint);
      const data = await res.json();
      console.log("Fetched projects:", username);
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