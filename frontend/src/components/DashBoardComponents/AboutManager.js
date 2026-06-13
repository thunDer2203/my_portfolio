"use client";
import { useState,useEffect } from "react";
import { useAboutStore } from "@/store/aboutStore";

export default function AboutManager() {
  const [form, setForm] = useState({ heading: "", content: "" });
  const [saved, setSaved] = useState(false);
  const { securedFetchAbout } = useAboutStore();
  
useEffect(() => {
  const loadAbout = async () => {
    try {
      const fetchedAbout =
        await securedFetchAbout();

      console.log(
        "Fetched about:",
        fetchedAbout
      );

      if (fetchedAbout) {
        setForm({
          heading:
            fetchedAbout.heading || "",
          content:
            fetchedAbout.content || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadAbout();
}, []);


  const hasContent = form.heading.trim() || form.content.trim();

  return (
    <div style={{ background: "#111", border: "1px solid #222", overflow: "hidden"}}>
      
      {/* Header */}
      <div style={{ padding: "1.75rem 2rem", borderBottom: "1px solid #1e1e1e" }}>
        <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "4px 10px", display: "inline-block", marginBottom: 14 }}>
          Portfolio section
        </span>
        <p style={{ fontSize: 22, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 4 }}>About you</p>
        <p style={{ fontSize: 14, color: "#555" }}>This is the first thing visitors see — make it count.</p>
      </div>

      {/* Body */}
      <div style={{ padding: "1.75rem 2rem" }}>

        {/* Tip */}
        <div style={{ display: "flex", gap: 10, background: "#0f1a2e", border: "1px solid #1a3050", borderRadius: 10, padding: "12px 14px", marginBottom: "1.75rem" }}>
          <span style={{ fontSize: 13, color: "#6899c4", lineHeight: 1.6 }}>
            💡 A great headline is specific. "CS undergrad building finance tools" beats "passionate developer".
          </span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Headline</label>
            <span style={{ fontSize: 11, color: form.heading.length > 65 ? "#c4893a" : "#333" }}>{form.heading.length} / 80</span>
          </div>
          <input
            type="text"
            maxLength={80}
            placeholder="e.g. CS undergrad building full-stack & data products"
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
            style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, color: "#e0e0e0", fontSize: 14, padding: "12px 14px", outline: "none", fontFamily: "inherit" }}
          />
        </div>

        {/* Bio */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Bio</label>
            <span style={{ fontSize: 11, color: form.content.length > 420 ? "#c4893a" : "#333" }}>{form.content.length} / 500</span>
          </div>
          <textarea
            rows={6}
            maxLength={500}
            placeholder="Talk about your background, what you build, and what you're working on..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, color: "#e0e0e0", fontSize: 14, padding: "12px 14px", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
          />
        </div>

        {/* Preview */}
        {hasContent && (
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: 12, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Preview</p>
            <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.25rem 1.5rem" }}>
              {form.heading && <p style={{ fontSize: 17, fontWeight: 600, color: "#e8e8e8", marginBottom: 6 }}>{form.heading}</p>}
              {form.content && <p style={{ fontSize: 13, color: "#666", lineHeight: 1.75 }}>{form.content}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "1.25rem 2rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #1a1a1a" }}>
        <span style={{ fontSize: 13, color: "#3a9e5f", opacity: saved ? 1 : 0, transition: "opacity 0.3s" }}>✓ Saved successfully</span>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0f0f0", color: "#111", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          Save about
        </button>
      </div>
    </div>
  );
}