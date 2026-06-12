import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const usePortfolioStore = create((set) => ({
  username: null,
  user:null,

  setUsername: (username) =>
    set({
      username,
    }),

  checkUsername: async (username) => {
    try {
      const res = await fetch(
        `${BASE}/users/${username}`
      );
      const data = await res.json();
      console.log("User data:", data);
      if (data.user) {
        set({ username,
          user:data.user,
         });
      }
      else {
        set({ username: null });
      }
      return res.ok;
    } catch {
      return false;
    }
  },
}));