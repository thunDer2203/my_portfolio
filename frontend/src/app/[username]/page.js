"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Hero from "@/components/Hero";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function UserPortfolio() {
  const params = useParams();

  const {
    setUsername,
    checkUsername,
  } = usePortfolioStore();

  const [showNotFound, setShowNotFound] =
    useState(false);

  useEffect(() => {
    const loadPortfolio = async () => {
      const exists = await checkUsername(
        params.username
      );

      if (!exists) {
        setShowNotFound(true);

        setTimeout(() => {
      setUsername(null);
          setShowNotFound(false);
        }, 3000);

        return;
      }

      setUsername(params.username);
    };

    loadPortfolio();
  }, [params.username]);

  return (
    <>
      {showNotFound && (
        <div className="fixed top-6 right-6 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          User does not exist.
          Create a portfolio instead.
        </div>
      )}

      <Hero />
    </>
  );
}