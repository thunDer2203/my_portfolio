"use client";
import { useState,useEffect } from "react";
import { useProjectStore } from "@/store/projectStore";

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const emptyProject = () => ({
  title: "", slug: "", shortDescription: "", longDescription: "",
  githubUrl: "", liveUrl: "", image: "", techStack: [],
  featured: false, _slugEdited: false,
});

export default function ProjectsManager() {
  const [projects, setProjects] = useState([emptyProject()]);
  const [saved, setSaved] = useState(false);
  const { securedFetchProjects } =useProjectStore();

useEffect(() => {
  const loadProjects = async () => {
    try {
      const fetchedProjects =await securedFetchProjects();
      // console.log("Fetched projects:", fetchedProjects);
      if (fetchedProjects.length > 0) {
        setProjects(
          fetchedProjects.map((project) => ({
            slug: project.slug || "",
            title: project.title || "",
            shortDescription:
              project.shortDescription || "",
              longDescription:project.longDescription || "",
            techStack:
              project.techStack || [],
            githubUrl:
              project.githubUrl || "",
            liveUrl:
              project.liveUrl || "",
            imageUrl:
              project.imageUrl || "",
            featured:
              project.featured || false,
          }))
        );
      }

      // console.log("Projects loaded successfully",projects);
    } catch (error) {
      console.error(error);
    }
  };

  loadProjects();
}, []);

  const update = (i, field, value) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [field]: value };
    if (field === "title" && !updated[i]._slugEdited) {
      updated[i].slug = slugify(value);
    }
    if (field === "slug") updated[i]._slugEdited = true;
    setProjects(updated);
  };

  const addTag = (i) => {
    const val = (projects[i].techInput || "").trim().replace(/,$/, "").trim();
    if (val && !projects[i].techStack.includes(val)) {
      const updated = [...projects];
      updated[i].techStack = [...updated[i].techStack, val];
      updated[i].techInput = "";
      setProjects(updated);
    }
  };

  const removeTag = (i, ti) => {
    const updated = [...projects];
    updated[i].techStack = updated[i].techStack.filter((_, idx) => idx !== ti);
    setProjects(updated);
  };

  const addProject = () => setProjects([...projects, emptyProject()]);
  const removeProject = (i) => setProjects(projects.filter((_, idx) => idx !== i));

 const handleSave = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          projects,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch (err) {
    console.error(err);
  }
};

  const inp = { background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#e0e0e0", fontSize: 13, padding: "10px 12px", outline: "none", fontFamily: "inherit", width: "100%" };
  const lbl = { fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "4px 10px", display: "inline-block", marginBottom: 12 }}>Portfolio section</span>
      <p style={{ fontSize: 24, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 4 }}>Projects</p>
      <p style={{ fontSize: 14, color: "#555", marginBottom: "2rem" }}>Add your portfolio projects — these show up on your main page</p>

      {projects.map((p, i) => (
        <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 16, overflow: "hidden", marginBottom: "1rem" }}>

          {/* Card Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{i + 1}</div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>{p.title || "Untitled project"}</span>
              {p.featured && <span style={{ fontSize: 10, fontWeight: 600, color: "#a06020", background: "#1e1508", border: "1px solid #3a2510", borderRadius: 20, padding: "3px 8px", textTransform: "uppercase" }}>★ Featured</span>}
            </div>
            {projects.length > 1 && (
              <button onClick={() => removeProject(i)} style={{ fontSize: 12, color: "#5a2020", background: "#1a0f0f", border: "1px solid #2e1515", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>Remove</button>
            )}
          </div>

          {/* Card Body */}
          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Title + Slug */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={lbl}>Project title</span>
                <input style={inp} type="text" placeholder="e.g. Finance Backend API" value={p.title} onChange={(e) => update(i, "title", e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={lbl}>Slug</span>
                <input style={inp} type="text" placeholder="Name to be Displayed" value={p.slug} onChange={(e) => update(i, "slug", e.target.value)} />
              </div>
            </div>

            {/* URLs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={lbl}>GitHub URL</span>
                <input style={inp} type="url" placeholder="https://github.com/..." value={p.githubUrl} onChange={(e) => update(i, "githubUrl", e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={lbl}>Live URL</span>
                <input style={inp} type="url" placeholder="https://..." value={p.liveUrl} onChange={(e) => update(i, "liveUrl", e.target.value)} />
              </div>
            </div>

            {/* Short description */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={lbl}>Short description</span>
                <span style={{ fontSize: 11, color: "#333" }}>{p.shortDescription.length} / 150</span>
              </div>
              <textarea rows={2} maxLength={150} placeholder="One-liner shown on project cards..." value={p.shortDescription} onChange={(e) => update(i, "shortDescription", e.target.value)}
                style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
            </div>

            {/* Long description */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={lbl}>Long description</span>
                <span style={{ fontSize: 11, color: "#333" }}>{p.longDescription.length} / 800</span>
              </div>
              <textarea rows={4} maxLength={800} placeholder="Full project details, challenges, what you learned..." value={p.longDescription} onChange={(e) => update(i, "longDescription", e.target.value)}
                style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
            </div>

            {/* Image */}
            {/* <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lbl}>Image URL</span>
              <input style={inp} type="url" placeholder="https://... (screenshot or banner)" value={p.image} onChange={(e) => update(i, "image", e.target.value)} />
            </div> */}

            {/* Tech stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lbl}>Tech stack</span>
              <input style={inp} type="text" placeholder="Type a technology and press Enter..." value={p.techInput}
                onChange={(e) => update(i, "techInput", e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(i); } }} />
              {p.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {p.techStack.map((t, ti) => (
                    <span key={ti} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888", background: "#161616", border: "1px solid #222", borderRadius: 6, padding: "4px 8px" }}>
                      {t}
                      <button onClick={() => removeTag(i, ti)} style={{ color: "#444", background: "none", border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, padding: "12px 14px" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 2 }}>Featured project</p>
                <span style={{ fontSize: 12, color: "#333" }}>Pinned to the top of your portfolio</span>
              </div>
              <div onClick={() => update(i, "featured", !p.featured)}
                style={{ width: 40, height: 22, borderRadius: 11, background: p.featured ? "#e0e0e0" : "#2a2a2a", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#111", position: "absolute", top: 3, left: p.featured ? 21 : 3, transition: "left 0.2s" }} />
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>
            <span style={{ fontSize: 12, color: "#2e2e2e" }}>{p.techStack.length} tech{p.techStack.length !== 1 ? "s" : ""} · {p.longDescription.length} chars</span>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "0.5rem" }}>
        <button onClick={addProject} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid #222", borderRadius: 10, color: "#888", fontSize: 13, fontWeight: 500, padding: "10px 16px", cursor: "pointer", fontFamily: "inherit" }}>
          + Add project
        </button>
        {saved && <span style={{ fontSize: 13, color: "#3a9e5f" }}>✓ Saved successfully</span>}
        <button onClick={handleSave} style={{ marginLeft: "auto", background: "#f0f0f0", border: "none", borderRadius: 10, color: "#111", fontSize: 13, fontWeight: 600, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit" }}>
          Save all projects
        </button>
      </div>
    </div>
  );
}