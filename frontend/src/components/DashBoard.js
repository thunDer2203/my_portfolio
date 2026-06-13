"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const router = useRouter();

  const { user, logout } = useAuthStore();

  const sections = [
    {
      title: "About",
      description: "Manage your about section",
      key: "about",
    },
    {
      title: "Skills",
      description: "Add technical and soft skills",
      key: "skills",
    },
    {
      title: "Projects",
      description: "Showcase your projects",
      key: "projects",
    },
    {
      title: "Experience",
      description: "Manage work experience",
      key: "experience",
    },
    {
      title: "Socials",
      description: "Connect your socials",
      key: "socials",
    },
    {
      title: "Resume",
      description: "Upload your resume",
      key: "resume",
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <section className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Portfolio Dashboard
            </h1>

            <p className="text-white/60 mt-1">
              Welcome back, {user?.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                window.open(
                  `/${user?.username}`,
                  "_blank"
                )
              }
              className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              View Portfolio
            </button>

            <button
              onClick={() => router.push(`/${user?.username}` )}
              className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              Open Terminal
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            Account Information
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-white/50 text-sm">
                Name
              </p>
              <p>{user?.name}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm">
                Username
              </p>
              <p>{user?.username}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm">
                Email
              </p>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={`/${user?.username}`}
              target="_blank"
              className="text-green-400 hover:text-green-300"
            >
              View Portfolio →
            </a>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">
          Portfolio Sections
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.key}
              className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
            >
              <h3 className="text-lg font-semibold">
                {section.title}
              </h3>

              <p className="text-white/60 text-sm mt-2">
                {section.description}
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/dashboard/${section.key}`
                  )
                }
                className="mt-5 w-full py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition cursor-pointer"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}