import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useExperienceStore = create((set) => ({
  experience: [],
  loading: false,

  securedFetchExperiences: async () => {
    try {
      
      const res =await fetch(`${BASE}/experience/secure`, {
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Request failed"
        );
      }
      
    return data.experiences || [];

    } catch (error) {
      console.error(error);
    }},


  fetchExperience: async (username = null) => {
    try {
      set({ loading: true });

      const endpoint = username
        ? `${BASE}/experience/${username}`
        : `${BASE}/experience`;

      const res = await fetch(endpoint);
      const data = await res.json();

      // console.log(data.experiences);

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