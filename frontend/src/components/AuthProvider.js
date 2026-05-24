"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return children;
}