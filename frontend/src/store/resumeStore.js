import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useResumeStore = create((set) => ({
  resume: null,
  loading: false,

  securedFetchResume: async () => {
    try {
      set({ loading: true });

      const endpoint = `${BASE}/resume`

      const res = await fetch(
        endpoint
          , { credentials: "include" }
      );

      const data = await res.json();

    //   console.log(
    //     "Fetched resume:",
    //     username || "current user"
    //   );

      set({
        resume: data.resume || null,
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