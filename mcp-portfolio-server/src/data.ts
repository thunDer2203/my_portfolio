/**
 * Data layer for the portfolio MCP server.
 *
 * Right now this returns mock data so you can run and test the server
 * immediately without wiring up a database.
 *
 * TO CONNECT YOUR REAL DATA:
 *   1. `npm install @prisma/client` in your portfolio repo (or point this
 *      package at your existing generated client).
 *   2. Replace the bodies of the functions below with real Prisma calls,
 *      e.g.:
 *        import { PrismaClient } from "@prisma/client";
 *        const prisma = new PrismaClient();
 *        export async function getProjects(username: string) {
 *          return prisma.project.findMany({ where: { user: { username } } });
 *        }
 *   3. Adjust the field names in the types below to match your actual
 *      Prisma schema (About, Skill, Project, Experience, Resume, SocialLink).
 *   4. Set DATABASE_URL in .env to your NeonDB connection string.
 */

export interface About {
  username: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
}

export interface Skill {
  name: string;
  category: string;
  proficiency?: string;
}

export interface Project {
  name: string;
  description: string;
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  role: string;
  company: string;
  startDate: string;
  endDate?: string; // omit/undefined = current
  summary: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

// ---- Mock data (swap for Prisma queries later) ----

const MOCK_ABOUT: About = {
  username: "thunder2203",
  name: "Shubham",
  headline: "Software Engineer (Implementation) at Osfin.ai",
  bio: "Full-stack engineer working across React, Next.js, Node.js, Express, Prisma and Postgres. Fell in love with coding in school, starting with QBasic, and never stopped.",
  location: "Bengaluru, India",
};

const MOCK_SKILLS: Skill[] = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Prisma", category: "Database" },
  { name: "Python", category: "Backend" },
  { name: "Java", category: "Backend" },
];

const MOCK_PROJECTS: Project[] = [
  {
    name: "Hookline",
    description:
      "Full-stack GitHub OAuth and webhook automation platform. Verifies incoming webhooks with HMAC-SHA256, applies a rules engine to auto-label, comment, and send Slack notifications on repo events, with idempotency handling to avoid duplicate actions.",
    stack: ["Next.js", "Express", "Prisma", "PostgreSQL", "GitHub OAuth"],
  },
  {
    name: "Portfolio as a Service",
    description:
      "Multi-user portfolio platform where each user gets a public page at /<username>, with a full admin panel for managing About, Skills, Projects, Experience, Resume, and Social Links.",
    stack: ["Next.js", "Express", "PostgreSQL", "NeonDB", "Prisma", "Cloudinary", "Zustand"],
  },
  {
    name: "Predictive Maintenance System",
    description:
      "XGBoost-based predictive maintenance system with a FastAPI inference service.",
    stack: ["Python", "XGBoost", "FastAPI"],
  },
];

const MOCK_EXPERIENCE: Experience[] = [
  {
    role: "Software Engineer (Implementation)",
    company: "Osfin.ai",
    startDate: "2025",
    summary: "Working on implementation engineering in fintech.",
  },
];

const MOCK_RESUME_URL = "https://example.com/shubham-resume.pdf";

const MOCK_SOCIAL_LINKS: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/thunDer2203" },
];

// ---- Accessor functions (this is what the MCP tools call) ----

export async function getAbout(): Promise<About> {
  return MOCK_ABOUT;
}

export async function getSkills(category?: string): Promise<Skill[]> {
  if (!category) return MOCK_SKILLS;
  return MOCK_SKILLS.filter(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getProjects(): Promise<Project[]> {
  return MOCK_PROJECTS;
}

export async function searchProjects(query: string): Promise<Project[]> {
  const q = query.toLowerCase();
  return MOCK_PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.stack.some((s) => s.toLowerCase().includes(q))
  );
}

export async function getExperience(): Promise<Experience[]> {
  return MOCK_EXPERIENCE;
}

export async function getResumeUrl(): Promise<string> {
  return MOCK_RESUME_URL;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return MOCK_SOCIAL_LINKS;
}
