"use client";

import { useEffect } from "react";

import { useAboutStore } from "../store/aboutStore";
import { useSkillStore } from "../store/skillStore";
import { useProjectStore } from "../store/projectStore";
import { useExperienceStore } from "../store/experienceStore";
import { useSocialStore } from "../store/socialStore";
import { useAuthStore } from "../store/authStore";
import { usePortfolioStore } from "../store/portfolioStore";
import { useResumeStore } from "../store/resumeStore";

export default function PortfolioProvider({
  children,
}) {
  const username = usePortfolioStore(
    (s) => s.username
  );

  useEffect(() => {
    useAuthStore.getState().checkAuth();
    // useResumeStore.getState().securedFetchResume();

    useAboutStore
      .getState()
      .fetchAbout(username);

    useSkillStore
      .getState()
      .fetchSkills(username);

    useProjectStore
      .getState()
      .fetchProjects(username);

    useExperienceStore
      .getState()
      .fetchExperience(username);

    useSocialStore
      .getState()
      .fetchSocials(username);
  }, [username]);

  return children;
}