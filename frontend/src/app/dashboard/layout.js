"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({
  children,
}) {
  const router = useRouter();

  const {
    user,
    checkAuth,
  } = useAuthStore();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();

      const currentUser =
        useAuthStore.getState().user;

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    verify();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}