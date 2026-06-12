
"use client";

import { useState } from "react";

export default function ResumeManager() {
  const [resume, setResume] = useState(null);

  return (
    <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Resume Upload
      </h2>

      <input
        type="text"
        placeholder="Resume Title"
        className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg"
      />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setResume(e.target.files[0])
        }
        className="w-full"
      />

      <button className="mt-4 px-5 py-2 bg-white text-black rounded-lg">
        Upload Resume
      </button>
    </div>
  );
}