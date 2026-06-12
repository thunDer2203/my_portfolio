"use client";

import { useState } from "react";

export default function AboutManager() {
  const [form, setForm] = useState({
    heading: "",
    content: "",
  });

  return (
    <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">About</h2>

      <input
        placeholder="Heading"
        value={form.heading}
        onChange={(e) =>
          setForm({
            ...form,
            heading: e.target.value,
          })
        }
        className="w-full p-3 rounded-lg bg-black border border-white/10 mb-4"
      />

      <textarea
        rows={6}
        placeholder="About Content"
        value={form.content}
        onChange={(e) =>
          setForm({
            ...form,
            content: e.target.value,
          })
        }
        className="w-full p-3 rounded-lg bg-black border border-white/10"
      />

      <button className="mt-4 px-5 py-2 bg-white text-black rounded-lg">
        Save About
      </button>
    </div>
  );
}