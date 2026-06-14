"use client";
import { useState,useEffect } from "react";
import { useExperienceStore } from "@/store/experienceStore";

const emptyExp = () => ({ company: "", role: "", description: "", startDate: "", endDate: "", current: false });

function calcDuration(start, end, current) {
  if (!start) return null;
  const s = new Date(start);
  const e = current ? new Date() : (end ? new Date(end) : null);
  if (!e) return null;
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (months < 1) return "< 1 month";
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;
  const y = Math.floor(months / 12), m = months % 12;
  return m > 0 ? `${y}y ${m}m` : `${y} year${y !== 1 ? "s" : ""}`;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([emptyExp()]);
  const [saved, setSaved] = useState(false);
  const { securedFetchExperiences } = useExperienceStore();

  useEffect(() => {
  const loadExperiences = async () => {
    try {
      const fetchedExperiences =await securedFetchExperiences();
      console.log("Fetched experiences:", fetchedExperiences);
      if (fetchedExperiences.length > 0) {
        setExperiences(
          fetchedExperiences.map((exp) => ({
            company: exp.company || "",
            role: exp.role || "",
            description: exp.description || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            current: exp.current || false,
          }))
        );
      }

      console.log("Experiences loaded successfully", experiences);
    } catch (error) {
      console.error(error);
    }
  };

  loadExperiences();
}, []);


  
  const update = (i, field, value) => {
    const updated = [...experiences];
    updated[i] = { ...updated[i], [field]: value };
    setExperiences(updated);
  };

  const addExperience = () => setExperiences([...experiences, emptyExp()]);
  const removeExperience = (i) => setExperiences(experiences.filter((_, idx) => idx !== i));
 
  const BASE = process.env.NEXT_PUBLIC_API_URL;

const handleSave = async () => {
  try {
    const res = await fetch(
      `${BASE}/experience`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          experiences,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Failed to save experiences"
      );
    }

    setSaved(true);
    setTimeout(
      () => setSaved(false),
      3000
    );
  } catch (error) {
    console.error(error);
  }
};

  const inp = { width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#e0e0e0", fontSize: 13, padding: "10px 12px", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "4px 10px", display: "inline-block", marginBottom: 12 }}>Portfolio section</span>
      <p style={{ fontSize: 24, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 4 }}>Experience</p>
      <p style={{ fontSize: 14, color: "#555", marginBottom: "2rem" }}>Add your work history — internships, jobs, and freelance roles</p>

      {experiences.map((exp, i) => {
        const dur = calcDuration(exp.startDate, exp.endDate, exp.current);
        const dateRange = exp.startDate ? `${formatDate(exp.startDate)} → ${exp.current ? "Present" : (exp.endDate ? formatDate(exp.endDate) : "—")}` : "";

        return (
          <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 16, overflow: "hidden", marginBottom: "1rem" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{i + 1}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>{exp.company || "Untitled company"}</p>
                  {exp.role && <p style={{ fontSize: 12, color: "#444" }}>{exp.role}</p>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {dur && <span style={{ fontSize: 11, color: "#555", background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "3px 9px" }}>{dur}</span>}
                {experiences.length > 1 && (
                  <button onClick={() => removeExperience(i)} style={{ fontSize: 12, color: "#5a2020", background: "#1a0f0f", border: "1px solid #2e1515", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>Remove</button>
                )}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 14 }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={lbl}>Company</span>
                  <input style={inp} type="text" placeholder="e.g. Osfin.ai" value={exp.company} onChange={(e) => update(i, "company", e.target.value)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={lbl}>Role</span>
                  <input style={inp} type="text" placeholder="e.g. Data Analyst" value={exp.role} onChange={(e) => update(i, "role", e.target.value)} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={lbl}>Description</span>
                  <span style={{ fontSize: 11, color: "#333" }}>{exp.description.length} / 500</span>
                </div>
                <textarea rows={3} maxLength={500} placeholder="What you did, what you built, and what impact you made..."
                  value={exp.description} onChange={(e) => update(i, "description", e.target.value)}
                  style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={lbl}>Start date</span>
                  <input style={{ ...inp, colorScheme: "dark" }} type="date" value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={lbl}>End date</span>
                  <input style={{ ...inp, colorScheme: "dark", opacity: exp.current ? 0.3 : 1 }} type="date" value={exp.endDate} disabled={exp.current} onChange={(e) => update(i, "endDate", e.target.value)} />
                </div>
              </div>

              {/* Current toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, padding: "11px 14px" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 2 }}>Currently working here</p>
                  <span style={{ fontSize: 12, color: "#333" }}>End date will show as "Present"</span>
                </div>
                <div onClick={() => update(i, "current", !exp.current)}
                  style={{ width: 40, height: 22, borderRadius: 11, background: exp.current ? "#e0e0e0" : "#2a2a2a", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#111", position: "absolute", top: 3, left: exp.current ? 21 : 3, transition: "left 0.2s" }} />
                </div>
              </div>
            </div>

            {/* Footer strip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 12, color: "#2e2e2e" }}>{dateRange || "No dates set"}</span>
              {exp.current && <span style={{ fontSize: 11, color: "#3a7a5f", background: "#0d1f18", border: "1px solid #1a3a28", borderRadius: 20, padding: "3px 9px" }}>● Active</span>}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "0.5rem" }}>
        <button onClick={addExperience} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid #222", borderRadius: 10, color: "#888", fontSize: 13, fontWeight: 500, padding: "10px 16px", cursor: "pointer", fontFamily: "inherit" }}>
          + Add experience
        </button>
        {saved && <span style={{ fontSize: 13, color: "#3a9e5f" }}>✓ Saved successfully</span>}
        <button onClick={handleSave} style={{ marginLeft: "auto", background: "#f0f0f0", border: "none", borderRadius: 10, color: "#111", fontSize: 13, fontWeight: 600, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit" }}>
          Save all experience
        </button>
      </div>
    </div>
  );
}