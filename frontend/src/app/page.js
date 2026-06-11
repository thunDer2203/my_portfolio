"use client";

import { useEffect } from "react";

import Hero from "@/components/Hero";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function Home() {
  const setUsername = usePortfolioStore(
    (s) => s.setUsername
  );

  useEffect(() => {
    setUsername(null);
  }, [setUsername]);

  return <Hero />;
}