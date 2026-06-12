"use client";

import { useState } from "react";

export default function ProjectsManager() {
  const [projects, setProjects] = useState([
    {
      title: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      githubUrl: "",
      liveUrl: "",
      image: "",
      techStack: "",
      featured: false,
    },
  ]);

  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: "",
        slug: "",
        shortDescription: "",
        longDescription: "",
        githubUrl: "",
        liveUrl: "",
        image: "",
        techStack: "",
        featured: false,
      },
    ]);
  };

  const removeProject = (index) => {
    setProjects(
      projects.filter((_, i) => i !== index)
    );
  };

  const updateProject = (
    index,
    field,
    value
  ) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleSave = async () => {
    try {
      const payload = projects.map((project) => ({
        ...project,
        techStack: project.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      }));

      console.log(payload);

      // await fetch("/projects", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     projects: payload,
      //   }),
      // });

      alert("Projects saved");
    } catch (error) {
      console.error(error);
      alert("Failed to save projects");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Projects
        </h2>

        <p className="text-white/60 mt-1">
          Add all your portfolio projects.
        </p>
      </div>

      {projects.map((project, index) => (
        <div
          key={index}
          className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              Project #{index + 1}
            </h3>

            {projects.length > 1 && (
              <button
                onClick={() =>
                  removeProject(index)
                }
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) =>
                updateProject(
                  index,
                  "title",
                  e.target.value
                )
              }
              className="p-3 rounded-lg bg-black border border-white/10"
            />

            <input
              type="text"
              placeholder="Slug"
              value={project.slug}
              onChange={(e) =>
                updateProject(
                  index,
                  "slug",
                  e.target.value
                )
              }
              className="p-3 rounded-lg bg-black border border-white/10"
            />

            <input
              type="text"
              placeholder="Github URL"
              value={project.githubUrl}
              onChange={(e) =>
                updateProject(
                  index,
                  "githubUrl",
                  e.target.value
                )
              }
              className="p-3 rounded-lg bg-black border border-white/10"
            />

            <input
              type="text"
              placeholder="Live URL"
              value={project.liveUrl}
              onChange={(e) =>
                updateProject(
                  index,
                  "liveUrl",
                  e.target.value
                )
              }
              className="p-3 rounded-lg bg-black border border-white/10"
            />
          </div>

          <textarea
            placeholder="Short Description"
            value={project.shortDescription}
            onChange={(e) =>
              updateProject(
                index,
                "shortDescription",
                e.target.value
              )
            }
            className="w-full mt-4 p-3 rounded-lg bg-black border border-white/10"
            rows={3}
          />

          <textarea
            placeholder="Long Description"
            value={project.longDescription}
            onChange={(e) =>
              updateProject(
                index,
                "longDescription",
                e.target.value
              )
            }
            className="w-full mt-4 p-3 rounded-lg bg-black border border-white/10"
            rows={5}
          />

          <input
            type="text"
            placeholder="Image URL"
            value={project.image}
            onChange={(e) =>
              updateProject(
                index,
                "image",
                e.target.value
              )
            }
            className="w-full mt-4 p-3 rounded-lg bg-black border border-white/10"
          />

          <input
            type="text"
            placeholder="Tech Stack (React, Node.js, Prisma)"
            value={project.techStack}
            onChange={(e) =>
              updateProject(
                index,
                "techStack",
                e.target.value
              )
            }
            className="w-full mt-4 p-3 rounded-lg bg-black border border-white/10"
          />

          <label className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(e) =>
                updateProject(
                  index,
                  "featured",
                  e.target.checked
                )
              }
            />

            <span>Featured Project</span>
          </label>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addProject}
          className="px-5 py-3 rounded-lg border border-white/10 hover:bg-white/10 transition"
        >
          + Add Project
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-3 rounded-lg bg-white text-black font-medium"
        >
          Save All Projects
        </button>
      </div>
    </div>
  );
}