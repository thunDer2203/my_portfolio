"use client";

import { useState } from "react";

export default function SkillsManager() {
  const [skills, setSkills] = useState([
    {
      name: "",
      category: "",
      description: "",
      level: "",
      image: null,
    },
  ]);

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        name: "",
        category: "",
        description: "",
        level: "",
        image: null,
      },
    ]);
  };

  const updateSkill = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="bg-[#0B0B0B] border border-white/10 rounded-xl p-5"
        >
          <div className="flex justify-between mb-4">
            <h3>Skill #{index + 1}</h3>

            {skills.length > 1 && (
              <button
                onClick={() => removeSkill(index)}
                className="text-red-400"
              >
                Remove
              </button>
            )}
          </div>

          <input
            placeholder="Skill Name"
            value={skill.name}
            onChange={(e) =>
              updateSkill(
                index,
                "name",
                e.target.value
              )
            }
            className="w-full p-3 mb-3 bg-black rounded-lg"
          />

          <input
            placeholder="Category"
            value={skill.category}
            onChange={(e) =>
              updateSkill(
                index,
                "category",
                e.target.value
              )
            }
            className="w-full p-3 mb-3 bg-black rounded-lg"
          />

          <input
            type="number"
            placeholder="Level"
            value={skill.level}
            onChange={(e) =>
              updateSkill(
                index,
                "level",
                e.target.value
              )
            }
            className="w-full p-3 mb-3 bg-black rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={skill.description}
            onChange={(e) =>
              updateSkill(
                index,
                "description",
                e.target.value
              )
            }
            className="w-full p-3 bg-black rounded-lg"
          />
        </div>
      ))}

      <button
        onClick={addSkill}
        className="px-5 py-2 border border-white/10 rounded-lg"
      >
        + Add Skill
      </button>

      <button className="ml-4 px-5 py-2 bg-white text-black rounded-lg">
        Save All Skills
      </button>
    </div>
  );
}