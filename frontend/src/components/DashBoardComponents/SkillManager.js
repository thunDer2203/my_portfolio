"use client";
import { useState,useEffect } from "react";
import { useSkillStore } from "@/store/skillStore";

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Machine Learning", "Data", "Mobile", "Other"];

function getLevelLabel(v) {
  if (v <= 2) return "Beginner";
  if (v <= 4) return "Familiar";
  if (v <= 6) return "Proficient";
  if (v <= 8) return "Advanced";
  return "Expert";
}


export default function SkillsManager() {
  const [skills, setSkills] = useState([{ name: "", category: "", description: "", level: 5 }]);
  const [saved, setSaved] = useState(false);
  const { securedFetchSkills } =
  useSkillStore();

useEffect(() => {
  const loadSkills = async () => {
    try {
      const fetchedSkills =
        await securedFetchSkills();

      if (fetchedSkills.length > 0) {
        setSkills(
          fetchedSkills.map((skill) => ({
            id: skill.id,
            name: skill.name || "",
            category: skill.category || "",
            description:
              skill.description || "",
            level: skill.level || 5,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadSkills();
}, []);

  const update = (i, field, value) => {
    const updated = [...skills];
    updated[i] = { ...updated[i], [field]: value };
    setSkills(updated);
  };

  const addSkill = () => setSkills([...skills, { name: "", category: "", description: "", level: 5 }]);
  const removeSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));
const BASE = process.env.NEXT_PUBLIC_API_URL;

const saveAll = async () => {
  try {
    const res = await fetch(`${BASE}/skills`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skills,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Failed to save skills"
      );
    }

    setSaved(true);

    fetchSkills();

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "4px 10px", display: "inline-block", marginBottom: 12 }}>
          Portfolio section
        </span>
        <p style={{ fontSize: 24, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 4 }}>Skills</p>
        <p style={{ fontSize: 14, color: "#555" }}>Add the tools and technologies you work with</p>
      </div>

      {/* Skill Cards */}
      {skills.map((skill, i) => (
        <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 16, overflow: "hidden", marginBottom: "1rem" }}>

          {/* Card Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{i + 1}</div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>{skill.name || "Untitled skill"}</span>
            </div>
            {skills.length > 1 && (
              <button onClick={() => removeSkill(i)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5a2020", background: "#1a0f0f", border: "1px solid #2e1515", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
                Remove
              </button>
            )}
          </div>

          {/* Card Body */}
          <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Skill name", field: "name", placeholder: "e.g. React, Python, PostgreSQL" },
            ].map(({ label, field, placeholder }) => (
              <div key={field} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
                <input type="text" placeholder={placeholder} value={skill[field]} onChange={(e) => update(i, field, e.target.value)}
                  style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#e0e0e0", fontSize: 13, padding: "10px 12px", outline: "none", fontFamily: "inherit" }} />
              </div>
            ))}

            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Category</label>
              <select value={skill.category} onChange={(e) => update(i, "category", e.target.value)}
                style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: skill.category ? "#e0e0e0" : "#2e2e2e", fontSize: 13, padding: "10px 12px", outline: "none", fontFamily: "inherit" }}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Level */}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Proficiency</label>
                <span style={{ fontSize: 11, color: "#555" }}>{getLevelLabel(skill.level)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="range" min={0} max={10} step={1} value={skill.level} onChange={(e) => update(i, "level", +e.target.value)}
                  style={{ flex: 1, accentColor: "#f0f0f0" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", minWidth: 28 }}>{skill.level}</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: 10 }, (_, d) => (
                  <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: skill.level >= (d + 1)  ? "#f0f0f0" : "#1e1e1e", transition: "background 0.2s" }} />
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</label>
              <textarea rows={3} placeholder="Brief note about how you use this skill..." value={skill.description} onChange={(e) => update(i, "description", e.target.value)} maxLength={200}
                style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#e0e0e0", fontSize: 13, padding: "10px 12px", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
              <span style={{ fontSize: 11, color: "#333", textAlign: "right" }}>{skill.description.length} / 200</span>
            </div>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "1.5rem" }}>
        <button onClick={addSkill} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid #222", borderRadius: 10, color: "#888", fontSize: 13, fontWeight: 500, padding: "10px 16px", cursor: "pointer", fontFamily: "inherit" }}>
          + Add skill
        </button>
        {saved && <span style={{ fontSize: 13, color: "#3a9e5f" }}>✓ Saved successfully</span>}
        <button onClick={saveAll} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, background: "#f0f0f0", border: "none", borderRadius: 10, color: "#111", fontSize: 13, fontWeight: 600, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit" }}>
          Save all skills
        </button>
      </div>
    </div>
  );
}