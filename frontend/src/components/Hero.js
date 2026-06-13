  "use client";

import { useRouter } from "next/navigation";
  import { useEffect, useRef, useState } from "react";
  import PortfolioHome from "./PortfolioHome";
  import { useSkillStore } from "../store/skillStore";
  import { useProjectStore } from "../store/projectStore";
  import { useExperienceStore } from "../store/experienceStore";
  import { useSocialStore } from "../store/socialStore";
  import { useAboutStore } from "../store/aboutStore";
  import { useAuthStore } from "../store/authStore";
  import { usePortfolioStore } from "../store/portfolioStore";

  export default function Hero() {

        const username = usePortfolioStore(
  (s) => s.username
);

    
const terminalUser = username || "shubham";

    const bootLines = [
    "$ boot portfolio.sys",
    "",
    "[OK] Initializing system...",
    "[OK] Loading projects database...",
    "[OK] Loading skills registry...",
    "[OK] Loading experience records...",
    "[OK] Loading social links...",
    "",
    "[OK] Portfolio API connected",
    "[OK] Visitor access granted",
    "",
    `Welcome to ${terminalUser}.OS v2.0`,
    "",
    'Type "help" for available commands.',
    "",
  ];

    const [history, setHistory] = useState([]);
    const [currentLine, setCurrentLine] = useState("");
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    // const [showDashboard, setShowDashboard] = useState(false);
    const [mounted, setMounted] = useState(false);



    const { user } = useAuthStore();
    const about = useAboutStore((s) => s.about);
    const skills = useSkillStore((s) => s.skills);
  const projects = useProjectStore((s) => s.projects);
  const experience = useExperienceStore((s) => s.experience);
  const socials = useSocialStore((s) => s.socials);

    const [showPortfolio, setShowPortfolio] = useState(false);
    // const [showRegister, setShowRegister] = useState(false);

    const bootComplete = lineIndex >= bootLines.length;
    const [command, setCommand] = useState("");
    const router = useRouter();

    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    /* ---------------- Boot Animation ---------------- */

    useEffect(() => {
      setMounted(true);
      if (bootComplete) return;

      const timeout = setTimeout(() => {
        const line = bootLines[lineIndex];

        if (charIndex < line.length) {
          setCurrentLine((prev) => prev + line[charIndex]);
          setCharIndex((prev) => prev + 1);
        } else {
          setHistory((prev) => [...prev, currentLine]);
          setCurrentLine("");
          setCharIndex(0);
          setLineIndex((prev) => prev + 1);
        }
      }, 25);

      return () => clearTimeout(timeout);
    }, [charIndex, lineIndex, currentLine, bootComplete]);

    /* ---------------- Focus after boot ---------------- */

    useEffect(() => {
      if (bootComplete) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      }
    }, [bootComplete]);

    /* ---------------- Auto Scroll ---------------- */

    useEffect(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, [history]);

    /* ---------------- Commands ---------------- */

    const commands = {
    help: [
      "",
      "Available commands:",
      "",
      "about        About me",
      "skills       Technical skills",
      "projects     View projects",
      "experience   Work experience",
      "socials      Social links",
      "resume       Download resume",
      "contact      Contact details",
      "exit         Launch portfolio UI",
      "clear        Clear terminal",
      "",
    ],

  };

  const executeCommand = () => {
    const cmd = command.trim().toLowerCase();

    if (!cmd) return;



    if (cmd === "about") {
    const output = [
      "",
      about?.heading || "About",
      "=".repeat((about?.heading || "About").length),
      "",
      ...(about?.content
        ? about.content.split(". ").map((line) => `${line.trim()}.`)
        : ["No about information available."]),
      "",
    ];

    setHistory((prev) => [
      ...prev,
      `${terminalUser}@portfolio:~$ about`,
      ...output,
    ]);

    setCommand("");
    return;
  }

    if (cmd === "clear") {
      setHistory([]);
      setCommand("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return;
    }

    if (cmd === "exit") {
      setHistory((prev) => [
        ...prev,
        `${terminalUser}@portfolio:~$ exit`,
        "",
        "Launching portfolio interface...",
        "",
      ]);

      setTimeout(() => {
        setShowPortfolio(true);
      }, 1500);

      setCommand("");
      return;
    }

    if (cmd === "resume") {
      setHistory((prev) => [
        ...prev,
        `${terminalUser}@portfolio:~$ resume`,
        "",
        "Downloading resume...",
        "",
      ]);

       const resumeUrl = terminalUser
    ? `${process.env.NEXT_PUBLIC_API_URL}/resume/${terminalUser}/download`
    : `${process.env.NEXT_PUBLIC_API_URL}/resume/download`;

  window.open(resumeUrl, "_blank");

      setCommand("");
      return;
    }

    if (cmd === "skills") {
    const output = [
      "",
      "Technical Skills",
      "================",
      "",
      ...skills.flatMap((skill) => [
        `▶ ${skill.name}`,
        `   Category    : ${skill.category}`,
        `   Level       : ${skill.level || "N/A"}/10`,
        `   Description : ${skill.description}`,
        "",
        "------------------------------------------------",
        "",
      ]),
    ];

    setHistory((prev) => [
      ...prev,
      `${terminalUser}@portfolio:~$ skills`,
      ...output,
    ]);

    setCommand("");
    return;
  }

    if (cmd === "projects") {
      const output = [
        "",
        "Projects",
        "--------",
        "",
        ...projects.flatMap((project) => [
          project.title,
          `   ${project.shortDescription}`,
          "",
        ]),
      ];

      setHistory((prev) => [
        ...prev,
        `${terminalUser}@portfolio:~$ projects`,
        ...output,
      ]);

      setCommand("");
      return;
    }

    if (cmd === "experience") {
      const output = [
        "",
        "Experience",
        "----------",
        "",
        ...experience.flatMap((exp) => [
          `${exp.role} @ ${exp.company}`,
          exp.description || "",
          "",
          "------------------------------------------------"
        ]),
      ];

      setHistory((prev) => [
        ...prev,
        `${terminalUser}@portfolio:~$ experience`,
        ...output,
      ]);

      setCommand("");
      return;
    }

  if (cmd === "socials") {
    const output = [
      "",
      "Social Links",
      "------------",
      "",
      ...socials.map((social) => (
        <div key={social.id}>
          {social.platform}:{" "}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white hover:text-blue-300 cursor-pointer"
          >
            {social.url}
          </a>
        </div>
      )),
      "",
    ];

    setHistory((prev) => [
      ...prev,
      `${terminalUser}@portfolio:~$ socials`,
      ...output,
    ]);

    setCommand("");
    return;
  }

    if (cmd === "contact") {
      const output = [
        "",
        "Get in touch",
        "",
        "Email: shubham@example.com",
        "",
        'Use "resume" to download CV',
        "",
      ];

      setHistory((prev) => [
        ...prev,
        `${terminalUser}@portfolio:~$ contact`,
        ...output,
      ]);

      setCommand("");
      return;
    }

    const output = commands[cmd] || [
      "",
      `Command not found: ${cmd}`,
      'Type "help" for available commands.',
      "",
    ];

    setHistory((prev) => [
      ...prev,
      `${terminalUser}@portfolio:~$ ${cmd}`,
      ...output,
    ]);

    setCommand("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  if(!mounted) return null;
    return (
      <>
      {/* {showDashboard && (<DashboardPage onReturn={() => setShowDashboard(false)}/>
)} */}
      {showPortfolio && <PortfolioHome onReturn={() => setShowPortfolio(false)} username={username} />}
        {/* {showRegister && (<RegisterPage onReturn={() => setShowRegister(false)}/>
)} */}
      {!showPortfolio && (<section className="relative min-h-screen bg-[#050505] overflow-hidden">
        {/* GRID */}

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
                  "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* SCANLINES */}

        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.03) 3px)",
          }}
        />

        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto border border-white/15 rounded-2xl overflow-hidden bg-[#0A0A0A] shadow-[0_0_80px_rgba(255,255,255,.05)]">
            {/* HEADER */}

            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />

    <span className="ml-4 text-white/50 text-sm font-mono">
     { `${terminalUser}@portfolio:~$`}
    </span>
  </div>
  <div className="flex items-center gap-2">
  <button
  onClick={() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  }}
  className="px-4 py-2 text-sm font-medium rounded-lg
             border border-white/20 text-white
             hover:bg-white hover:text-black
             transition-all duration-200 cursor-pointer"
>
  {user ? "Dashboard" : "Create Portfolio"}
</button>

  <button
    onClick={() => setShowPortfolio(true)}
    className="px-4 py-2 text-sm font-medium rounded-lg
               bg-white text-black
               hover:bg-white/90
               transition-all duration-200 cursor-pointer"
  >
    View Portfolio →
  </button>

  </div>
</div>

            {/* TERMINAL */}

            <div
              className="min-h-[85vh] p-6 font-mono text-white cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, index) => (
                <div
                  key={index}
                  className="whitespace-pre-wrap leading-relaxed"
                >
                  {line}
                </div>
              ))}

              {!bootComplete && (
                <div>
                  {currentLine}
                  <span className="terminal-cursor">█</span>
                </div>
              )}

              {bootComplete && (
                <>
                  <input
                    ref={inputRef}
                    autoFocus
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        executeCommand();
                      }
                    }}
                    className="absolute opacity-0 pointer-events-none"
                  />

                  <div className="flex flex-wrap items-center mt-2">
                    <span className="text-white font-semibold">
    {`${terminalUser}`}@portfolio:~$&nbsp;
  </span>

                    <span>{command}</span>

                    <span className="terminal-cursor ml-[1px]">
                      █
                    </span>
                  </div>
                </>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        </div>
      </section>)}
      </>
    );
  }