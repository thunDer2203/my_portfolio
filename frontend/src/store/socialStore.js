import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useSocialStore = create((set) => ({
  socials: [],
  loading: false,


  securedFetchSocials: async (
    options = {}
  ) => {
    const res = await fetch(
      `${BASE}/socials/secure`,
      {
        credentials: "include",
        ...options,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Request failed"
      );
    }

    return data.socials || [];
  },


 fetchSocials: async (username = null) => {
  try {
    set({ loading: true });

    const endpoint = username
      ? `${BASE}/socials/${username}`
      : `${BASE}/socials`;

    const res = await fetch(
      endpoint,
      username
        ? {}
        : {
            credentials: "include",
          }
    );

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