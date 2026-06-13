"use client";
import { useState,useEffect } from "react";
import { useSocialStore } from "@/store/socialStore";

const PLATFORMS = [
  { id: "github",    name: "GitHub",    icon: "ti-brand-github",    placeholder: "https://github.com/username" },
  { id: "linkedin",  name: "LinkedIn",  icon: "ti-brand-linkedin",  placeholder: "https://linkedin.com/in/username" },
  { id: "twitter",   name: "Twitter",   icon: "ti-brand-twitter",   placeholder: "https://twitter.com/username" },
  { id: "instagram", name: "Instagram", icon: "ti-brand-instagram", placeholder: "https://instagram.com/username" },
  { id: "youtube",   name: "YouTube",   icon: "ti-brand-youtube",   placeholder: "https://youtube.com/@channel" },
  { id: "dribbble",  name: "Dribbble",  icon: "ti-brand-dribbble",  placeholder: "https://dribbble.com/username" },
  { id: "behance",   name: "Behance",   icon: "ti-brand-behance",   placeholder: "https://behance.net/username" },
  { id: "medium",    name: "Medium",    icon: "ti-brand-medium",    placeholder: "https://medium.com/@username" },
  { id: "devto",     name: "Dev.to",    icon: "ti-brand-devto",     placeholder: "https://dev.to/username" },
  { id: "other",     name: "Other",     icon: "ti-link",            placeholder: "https://..." },
];

const emptySOCial = () => ({ platform: "", url: "" });

export default function SocialManager() {
  const [socials, setSocials] = useState([emptySOCial()]);
  const [saved, setSaved] = useState(false);
// const { socials, fetchSocials } =useSocialStore();

const {
  securedFetchSocials 
} = useSocialStore();

// console.log("social mounted");


useEffect(() => {
  const loadSocials = async () => {
    try {
      const socials =
        await securedFetchSocials();

      if (socials.length > 0) {
        setSocials(
          socials.map((social) => ({
            platform: social.platform,
            url: social.url,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadSocials();
}, []);


  const update = (i, field, value) => {
    const updated = [...socials];
    updated[i] = { ...updated[i], [field]: value };
    setSocials(updated);
  };

  const addSocial = () => setSocials([...socials, emptySOCial()]);
  const removeSocial = (i) => setSocials(socials.filter((_, idx) => idx !== i));
const BASE = process.env.NEXT_PUBLIC_API_URL;

const handleSave = async () => {
  try {
    const res = await fetch(`${BASE}/socials`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        socials,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Failed to save socials"
      );
    }

    await fetchSocials();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  const inp = { width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#e0e0e0", fontSize: 13, padding: "10px 12px", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "4px 10px", display: "inline-block", marginBottom: 12 }}>Portfolio section</span>
      <p style={{ fontSize: 24, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 4 }}>Social links</p>
      <p style={{ fontSize: 14, color: "#555", marginBottom: "2rem" }}>Add your profiles so visitors can connect with you</p>

      {socials.map((social, i) => {
        const plat = PLATFORMS.find(
  (p) =>
    p.id.toLowerCase() ===
    social.platform?.toLowerCase()
);
        const isValidUrl = social.url.startsWith("http");

        return (
          <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 16, overflow: "hidden", marginBottom: "1rem" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  <i className={`ti ${plat?.icon ?? "ti-link"}`} style={{ color: plat ? "#888" : "#333" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>{plat?.name ?? "Untitled link"}</p>
                  <span style={{ fontSize: 12, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260, display: "block" }}>{social.url || "No URL set"}</span>
                </div>
              </div>
              {socials.length > 1 && (
                <button onClick={() => removeSocial(i)} style={{ fontSize: 12, color: "#5a2020", background: "#1a0f0f", border: "1px solid #2e1515", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>Remove</button>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Platform picker */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={lbl}>Platform</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {PLATFORMS.map((p) => {
  const isSelected =
    social.platform?.toLowerCase() ===
    p.id.toLowerCase();

  return (
    <button
      key={p.id}
      onClick={() => update(i, "platform", p.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        background: isSelected
          ? "#1a1a1a"
          : "#0d0d0d",
        border: `1px solid ${
          isSelected ? "#444" : "#1e1e1e"
        }`,
        borderRadius: 10,
        padding: "10px 6px",
        cursor: "pointer",
      }}
    >
      <i
        className={`ti ${p.icon}`}
        style={{
          fontSize: 18,
          color: isSelected ? "#ccc" : "#444",
        }}
      />

      <span
        style={{
          fontSize: 10,
          color: isSelected ? "#888" : "#555",
          fontWeight: 500,
        }}
      >
        {p.name}
      </span>
    </button>
  );
})}
                </div>
              </div>

              {/* URL */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={lbl}>Profile URL</span>
                <input style={inp} type="url" placeholder={plat?.placeholder ?? "https://..."} value={social.url} onChange={(e) => update(i, "url", e.target.value)} />
                {isValidUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d1a0f", border: "1px solid #1a3020", borderRadius: 8, padding: "9px 12px" }}>
                    <i className="ti ti-external-link" style={{ fontSize: 14, color: "#3a9e5f", flexShrink: 0 }} />
                    <a href={social.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#3a9e5f", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{social.url}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer strip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 12, color: "#2e2e2e" }}>{plat?.name ?? "No platform selected"} · {isValidUrl ? "URL set" : "Missing URL"}</span>
              {isValidUrl && <span style={{ fontSize: 11, color: "#3a9e5f", background: "#0d1f18", border: "1px solid #1a3a28", borderRadius: 20, padding: "3px 9px" }}>● Ready</span>}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "0.5rem" }}>
        <button onClick={addSocial} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid #222", borderRadius: 10, color: "#888", fontSize: 13, fontWeight: 500, padding: "10px 16px", cursor: "pointer", fontFamily: "inherit" }}>
          + Add social link
        </button>
        {saved && <span style={{ fontSize: 13, color: "#3a9e5f" }}>✓ Saved successfully</span>}
        <button onClick={handleSave} style={{ marginLeft: "auto", background: "#f0f0f0", border: "none", borderRadius: 10, color: "#111", fontSize: 13, fontWeight: 600, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit" }}>
          Save all links
        </button>
      </div>
    </div>
  );
}