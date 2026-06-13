"use client";
import { useState,useEffect } from "react";
import { useResumeStore } from "@/store/resumeStore";

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function ResumeManager() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const {
  resume,
  securedFetchResume: fetchResume,
} = useResumeStore();

useEffect(() => {
  fetchResume();
}, []);

useEffect(() => {
  if (resume) {
    setTitle(resume.title || "");
  }
}, [resume]);

  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

const BASE = process.env.NEXT_PUBLIC_API_URL;

const upload = async () => {
  try {
    const formData = new FormData();

    formData.append("title", title);

    if (file) {
      formData.append("resume", file);
    }

    const res = await fetch(
      `${BASE}/resume`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Failed to upload resume"
      );
    }

    await fetchResume();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  const s = (obj) => obj; // inline style shorthand

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Page header */}
      <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "4px 10px", display: "inline-block", marginBottom: 12 }}>
        Portfolio section
      </span>
      <p style={{ fontSize: 24, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 4 }}>Resume</p>
      <p style={{ fontSize: 14, color: "#555", marginBottom: "2rem" }}>Upload your resume so visitors can download it from your portfolio</p>

      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, overflow: "hidden" }}>

        {/* Title */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #1a1a1a" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Resume title</p>
          <input
            type="text"
            placeholder="e.g. Shubham Resume — Software Engineer 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#e0e0e0", fontSize: 14, padding: "11px 14px", outline: "none", fontFamily: "inherit" }}
          />
        </div>

        {/* Upload */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #1a1a1a" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>PDF file</p>

          {!file ? (
            <div
              onClick={() => document.getElementById("resume-file-input").click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{ border: `1px dashed ${dragging ? "#444" : "#2a2a2a"}`, borderRadius: 12, padding: "2.5rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", background: dragging ? "#161616" : "#0d0d0d", textAlign: "center", transition: "all 0.2s" }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1a1a1a", border: "1px solid #252525", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 22, color: "#555" }}>↑</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>Drop your PDF here or <span style={{ color: "#e0e0e0", textDecoration: "underline" }}>browse</span></p>
              <p style={{ fontSize: 12, color: "#333" }}>Only .pdf files · Max 5MB</p>
              <input id="resume-file-input" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#0d1a0f", border: "1px solid #1a3020", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#0f2018", border: "1px solid #1e4030", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, color: "#3a9e5f" }}>
                📄
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#e0e0e0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                <p style={{ fontSize: 11, color: "#3a9e5f", marginTop: 2 }}>{formatSize(file.size)}</p>
              </div>
              <button onClick={() => setFile(null)} style={{ fontSize: 12, color: "#5a2020", background: "#1a0f0f", border: "1px solid #2e1515", borderRadius: 6, padding: "4px 9px", cursor: "pointer" }}>
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Tip */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", gap: 10, background: "#0f1a2e", border: "1px solid #1a3050", borderRadius: 10, padding: "12px 14px" }}>
            <span style={{ fontSize: 13, color: "#6899c4", lineHeight: 1.6 }}>
              💡 Make sure your resume is ATS-friendly — use clean fonts, no tables, and keyword-rich sections. Recruiters often scan PDFs with automated tools first.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", background: "#0d0d0d",padding: "1.5rem",gap:14,marginLeft:"50rem" }}>
          <span style={{ fontSize: 13, color: "#3a9e5f", opacity: saved ? 1 : 0, transition: "opacity 0.3s" }}>✓ Uploaded successfully</span>
          <button
            onClick={upload}
            disabled={!file}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#f0f0f0", border: "none", borderRadius: 10, color: "#111", fontSize: 13, fontWeight: 600, padding: "10px 20px", cursor: file ? "pointer" : "not-allowed", opacity: file ? 1 : 0.3, fontFamily: "inherit" }}
          >
            Upload resume
          </button>
          <button
      onClick={() =>
        window.open(
          resume.fileUrl,
          "_blank"
        )
      }
      style={{
        background: "#f0f0f0",
        border: "none",
        borderRadius: 8,
        color: "#111",
        fontSize: 13,
        fontWeight: 600,
        padding: "8px 14px",
        cursor: "pointer",
      }}
    >
      View Current Resume
    </button>
        </div>
      </div>
    </div>
  );
}