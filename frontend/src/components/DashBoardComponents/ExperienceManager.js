"use client";

import { useState } from "react";

export default function ExperienceManager() {
  const [experiences, setExperiences] =
    useState([
      {
        company: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
      },
    ]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const updateExperience = (
    index,
    field,
    value
  ) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="bg-[#0B0B0B] border border-white/10 rounded-xl p-5"
        >
          <input
            placeholder="Company"
            value={exp.company}
            onChange={(e) =>
              updateExperience(
                index,
                "company",
                e.target.value
              )
            }
            className="w-full p-3 mb-3 bg-black rounded-lg"
          />

          <input
            placeholder="Role"
            value={exp.role}
            onChange={(e) =>
              updateExperience(
                index,
                "role",
                e.target.value
              )
            }
            className="w-full p-3 mb-3 bg-black rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={exp.description}
            onChange={(e) =>
              updateExperience(
                index,
                "description",
                e.target.value
              )
            }
            className="w-full p-3 mb-3 bg-black rounded-lg"
          />

          <input
            type="date"
            value={exp.startDate}
            onChange={(e) =>
              updateExperience(
                index,
                "startDate",
                e.target.value
              )
            }
            className="w-full p-3 mb-3 bg-black rounded-lg"
          />

          <input
            type="date"
            value={exp.endDate}
            onChange={(e) =>
              updateExperience(
                index,
                "endDate",
                e.target.value
              )
            }
            className="w-full p-3 bg-black rounded-lg"
          />
        </div>
      ))}

      <button
        onClick={addExperience}
        className="px-5 py-2 border border-white/10 rounded-lg"
      >
        + Add Experience
      </button>

      <button className="ml-4 px-5 py-2 bg-white text-black rounded-lg">
        Save All Experience
      </button>
    </div>
  );
}