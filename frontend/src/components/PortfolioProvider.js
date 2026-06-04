"use client";

import { useEffect } from "react";

import { useHeroStore } from "../store/heroStore";
import { useAboutStore } from "../store/aboutStore";
import { useSkillStore } from "../store/skillStore";
import { useProjectStore } from "../store/projectStore";
import { useExperienceStore } from "../store/experienceStore";
import { useSocialStore } from "../store/socialStore";

export default function PortfolioProvider({ children }) {
  useEffect(() => {
    useHeroStore.getState().fetchHero();
    useAboutStore.getState().fetchAbout();
    useSkillStore.getState().fetchSkills();
    useProjectStore.getState().fetchProjects();
    useExperienceStore.getState().fetchExperience();
    useSocialStore.getState().fetchSocials();
  }, []);

  return children;
}