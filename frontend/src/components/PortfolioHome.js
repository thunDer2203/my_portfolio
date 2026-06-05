"use client";

import { useEffect, useRef, useState } from "react";
import { useSkillStore } from "../store/skillStore";
import { useProjectStore } from "../store/projectStore";
import { useExperienceStore } from "../store/experienceStore";
import { useSocialStore } from "../store/socialStore";
import { useAboutStore } from "../store/aboutStore";

/* ─── tiny hook: fires when element enters viewport ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Glitch text ─── */
function GlitchText({ text, className = "" }) {
  return (
    <span className={`glitch-wrap ${className}`} data-text={text}>
      {text}
    </span>
  );
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Skill bar ─── */
function SkillBar({ skill, index, inView }) {
  const pct = ((skill.level || 7) / 10) * 100;
  return (
    <div
      className="skill-row"
      style={{ animationDelay: `${index * 80}ms`, opacity: inView ? 1 : 0 }}
    >
      <div className="skill-meta">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-cat">{skill.category}</span>
        <span className="skill-lvl">{skill.level || "?"}/10</span>
      </div>
      <div className="bar-bg">
        <div
          className="bar-fill"
          style={{
            width: inView ? `${pct}%` : "0%",
            transitionDelay: `${index * 80 + 200}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Project card ─── */
function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className="project-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="card-num">0{index + 1}</div>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-desc">{project.shortDescription}</p>
      {project.techStack?.length > 0 && (
        <div className="card-tags">
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          View project →
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          View github →
        </a>
      )}
    </div>
  );
}

/* ─── Experience item ─── */
function ExpItem({ exp, index }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className="exp-item"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-30px)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="exp-dot" />
      <div className="exp-body">
        <div className="exp-role">{exp.role}</div>
        <div className="exp-company">{exp.company}</div>
        {exp.duration && <div className="exp-dur">{exp.duration}</div>}
        {exp.description && <p className="exp-desc">{exp.description}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ MAIN ══ */
export default function PortfolioHome({ onReturn }) {
  const about = useAboutStore((s) => s.about);
  const skills = useSkillStore((s) => s.skills);
  const projects = useProjectStore((s) => s.projects);
  const experience = useExperienceStore((s) => s.experience);
  const socials = useSocialStore((s) => s.socials);

  const [skillsRef, skillsInView] = useInView(0.05);
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* ── particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const DOTS = 90;
    const dots = Array.from({ length: DOTS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74,222,128,0.35)";
        ctx.fill();
      });

      /* connections */
      for (let i = 0; i < DOTS; i++) {
        for (let j = i + 1; j < DOTS; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(74,222,128,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  /* ── mouse parallax for hero ── */
  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const px = (mousePos.x / window.innerWidth - 0.5) * 18;
  const py = (mousePos.y / window.innerHeight - 0.5) * 10;

  return (
    <>
      {/* ── global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pf-root {
          font-family: 'Syne', sans-serif;
          background: #060910;
          color: #e8eaf0;
          min-height: 100vh;
          overflow-x: hidden;
          cursor: none;
        }

        /* custom cursor */
        .cursor-dot {
          width: 8px; height: 8px;
          background: #4ade80;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%,-50%);
          transition: transform .1s;
        }
        .cursor-ring {
          width: 36px; height: 36px;
          border: 1px solid rgba(74,222,128,.5);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%,-50%);
          transition: left .12s ease, top .12s ease, width .2s, height .2s;
        }

        /* nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 2.5rem;
          border-bottom: 1px solid rgba(255,255,255,.06);
          backdrop-filter: blur(14px);
          background: rgba(6,9,16,.7);
        }
        .nav-logo {
          font-family: 'Space Mono', monospace;
          color: #4ade80;
          font-size: .95rem;
          letter-spacing: .05em;
        }
        .nav-btn {
          font-family: 'Space Mono', monospace;
          font-size: .8rem;
          padding: .5rem 1.2rem;
          border: 1px solid rgba(74,222,128,.4);
          border-radius: 4px;
          background: transparent;
          color: #4ade80;
          cursor: none;
          transition: background .2s, color .2s;
          letter-spacing: .08em;
        }
        .nav-btn:hover { background: #4ade80; color: #060910; }

        /* section wrapper */
        .section { padding: 7rem 2.5rem; max-width: 1200px; margin: 0 auto; }
        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: .72rem;
          letter-spacing: .3em;
          color: #4ade80;
          text-transform: uppercase;
          margin-bottom: 1rem;
          display: flex; align-items: center; gap: .75rem;
        }
        .section-label::after {
          content: '';
          flex: 1; max-width: 60px;
          height: 1px;
          background: #4ade80;
          opacity: .4;
        }

        /* ── HERO ── */
        .hero-wrap {
          position: relative;
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 0 2.5rem;
          overflow: hidden;
        }
        .hero-canvas {
          position: absolute; inset: 0;
          pointer-events: none;
        }
        .hero-content {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto; width: 100%;
        }
        .hero-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: .8rem;
          letter-spacing: .3em;
          color: #4ade80;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          animation: fadeUp .8s .2s both;
        }
        .hero-name {
          font-size: clamp(4rem, 10vw, 9rem);
          font-weight: 800;
          line-height: .95;
          letter-spacing: -.03em;
          margin-bottom: 1.5rem;
          animation: fadeUp .8s .35s both;
        }
        .hero-name-accent { color: #4ade80; }
        .hero-sub {
          max-width: 520px;
          font-size: 1.15rem;
          color: rgba(232,234,240,.55);
          line-height: 1.7;
          animation: fadeUp .8s .5s both;
          margin-bottom: 2.5rem;
        }
        .hero-ctas {
          display: flex; flex-wrap: wrap; gap: 1rem;
          animation: fadeUp .8s .65s both;
        }
        .cta-primary {
          padding: .85rem 2rem;
          background: #4ade80;
          color: #060910;
          font-weight: 700;
          font-size: .9rem;
          border: none;
          border-radius: 4px;
          cursor: none;
          letter-spacing: .06em;
          transition: filter .2s, transform .2s;
          text-decoration: none;
        }
        .cta-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .cta-secondary {
          padding: .85rem 2rem;
          background: transparent;
          color: #e8eaf0;
          font-size: .9rem;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 4px;
          cursor: none;
          letter-spacing: .06em;
          transition: border-color .2s, color .2s, transform .2s;
          text-decoration: none;
        }
        .cta-secondary:hover { border-color: #4ade80; color: #4ade80; transform: translateY(-2px); }

        .hero-stats {
          position: absolute; bottom: 3rem; right: 2.5rem;
          display: flex; gap: 3rem;
          animation: fadeUp .8s .8s both;
        }
        .stat-num {
          font-size: 2.4rem; font-weight: 800;
          color: #4ade80; line-height: 1;
        }
        .stat-label {
          font-family: 'Space Mono', monospace;
          font-size: .68rem; letter-spacing: .15em;
          color: rgba(232,234,240,.4);
          text-transform: uppercase;
          margin-top: .3rem;
        }

        .hero-bg-text {
          position: absolute;
          right: -2rem; top: 50%;
          transform: translateY(-50%);
          font-size: clamp(8rem, 18vw, 18rem);
          font-weight: 800;
          color: rgba(74,222,128,.03);
          letter-spacing: -.06em;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
        }

        /* ── GLITCH ── */
        .glitch-wrap {
          position: relative;
          display: inline-block;
        }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }
        .glitch-wrap::before {
          color: #4ade80;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          animation: glitch1 4s infinite;
        }
        .glitch-wrap::after {
          color: #818cf8;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          animation: glitch2 4s infinite;
        }
        @keyframes glitch1 {
          0%,90%,100% { transform: none; opacity: 0; }
          91% { transform: translate(-3px,1px); opacity: .7; }
          93% { transform: translate(3px,-1px); opacity: .5; }
          95% { transform: translate(-2px,2px); opacity: .7; }
        }
        @keyframes glitch2 {
          0%,90%,100% { transform: none; opacity: 0; }
          92% { transform: translate(3px,-2px); opacity: .6; }
          94% { transform: translate(-3px,1px); opacity: .4; }
          96% { transform: translate(2px,-1px); opacity: .6; }
        }

        /* ── ABOUT ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        @media(max-width:768px){ .about-grid { grid-template-columns: 1fr; gap: 2.5rem; } }
        .about-heading {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -.02em;
          margin-bottom: 1.5rem;
        }
        .about-text {
          color: rgba(232,234,240,.6);
          font-size: 1rem;
          line-height: 1.85;
        }
        .about-right {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
        }
        .about-card {
          border: 1px solid rgba(74,222,128,.15);
          border-radius: 12px;
          padding: 1.5rem;
          background: rgba(74,222,128,.03);
          transition: border-color .3s, background .3s, transform .3s;
        }
        .about-card:hover {
          border-color: rgba(74,222,128,.4);
          background: rgba(74,222,128,.07);
          transform: translateY(-4px);
        }
        .about-card-icon { font-size: 1.5rem; margin-bottom: .75rem; }
        .about-card-title {
          font-size: .9rem; font-weight: 700; margin-bottom: .4rem;
        }
        .about-card-desc {
          font-size: .78rem;
          color: rgba(232,234,240,.45);
          line-height: 1.6;
        }

        /* ── SKILLS ── */
        .skills-inner {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        @media(max-width:768px){ .skills-inner { grid-template-columns: 1fr; } }
        .skill-row {
          transition: opacity .5s, transform .5s;
          transform: translateY(0);
        }
        .skill-meta {
          display: flex; align-items: center; gap: .75rem;
          margin-bottom: .4rem;
        }
        .skill-name { font-size: .92rem; font-weight: 700; }
        .skill-cat {
          font-family: 'Space Mono', monospace;
          font-size: .65rem;
          color: rgba(232,234,240,.35);
          letter-spacing: .08em;
          border: 1px solid rgba(255,255,255,.1);
          padding: .1rem .45rem;
          border-radius: 3px;
        }
        .skill-lvl {
          font-family: 'Space Mono', monospace;
          font-size: .7rem; color: #4ade80;
          margin-left: auto;
        }
        .bar-bg {
          height: 3px;
          background: rgba(255,255,255,.07);
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ade80, #a3e635);
          border-radius: 3px;
          transition: width .9s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 0 8px rgba(74,222,128,.5);
        }

        /* ── PROJECTS ── */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .project-card {
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          padding: 2rem;
          background: rgba(255,255,255,.02);
          transition: opacity .5s, transform .5s, border-color .3s, background .3s;
          cursor: none;
          position: relative;
          overflow: hidden;
        }
        .project-card::before {
          pointer-events: none;
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(74,222,128,.07), transparent 70%);
          opacity: 0;
          transition: opacity .4s;
        }
        .project-card:hover::before { opacity: 1; }
        .project-card:hover {
          border-color: rgba(74,222,128,.3);
          background: rgba(74,222,128,.04);
        }
        .card-num {
          font-family: 'Space Mono', monospace;
          font-size: .68rem;
          color: #4ade80;
          letter-spacing: .12em;
          margin-bottom: 1.2rem;
          opacity: .7;
        }
        .card-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: .75rem;
          letter-spacing: -.01em;
        }
        .card-desc {
          font-size: .9rem;
          color: rgba(232,234,240,.5);
          line-height: 1.7;
          margin-bottom: 1.2rem;
        }
        .card-tags { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.2rem; }
        .tag {
          font-family: 'Space Mono', monospace;
          font-size: .65rem;
          padding: .25rem .6rem;
          border: 1px solid rgba(74,222,128,.25);
          border-radius: 3px;
          color: #4ade80;
          letter-spacing: .06em;
        }
        .card-link {
          font-family: 'Space Mono', monospace;
          font-size: .75rem;
          color: rgba(232,234,240,.4);
          text-decoration: none;
          letter-spacing: .08em;
          transition: color .2s;
        }
        .card-link:hover { color: #4ade80; }

        /* ── EXPERIENCE ── */
        .exp-list { position: relative; padding-left: 2rem; }
        .exp-list::before {
          content: '';
          position: absolute; left: 0; top: .5rem; bottom: .5rem;
          width: 1px;
          background: linear-gradient(to bottom, #4ade80, transparent);
          opacity: .3;
        }
        .exp-item {
          display: flex; gap: 1.5rem;
          margin-bottom: 3rem;
          transition: opacity .5s, transform .5s;
        }
        .exp-dot {
          position: absolute; left: -2.4rem;
          width: 9px; height: 9px;
          background: #4ade80;
          border-radius: 50%;
          margin-top: .4rem;
          box-shadow: 0 0 12px #4ade80;
          flex-shrink: 0;
        }
        .exp-body { position: relative; }
        .exp-role {
          font-size: 1.15rem; font-weight: 700;
          margin-bottom: .2rem;
        }
        .exp-company { color: #4ade80; font-size: .9rem; margin-bottom: .3rem; }
        .exp-dur {
          font-family: 'Space Mono', monospace;
          font-size: .68rem;
          color: rgba(232,234,240,.35);
          letter-spacing: .1em;
          margin-bottom: .75rem;
        }
        .exp-desc { font-size: .9rem; color: rgba(232,234,240,.55); line-height: 1.7; }

        /* ── SOCIALS / CONTACT ── */
        .contact-wrap {
          display: flex; flex-wrap: wrap; gap: 1.5rem;
          margin-top: 2rem;
        }
        .social-pill {
          display: flex; align-items: center; gap: .75rem;
          padding: .9rem 1.5rem;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          background: rgba(255,255,255,.02);
          text-decoration: none;
          color: #e8eaf0;
          font-size: .88rem;
          transition: border-color .2s, background .2s, transform .2s;
          cursor: none;
        }
        .social-pill:hover {
          border-color: rgba(74,222,128,.4);
          background: rgba(74,222,128,.06);
          transform: translateY(-3px);
          color: #4ade80;
        }
        .social-dot {
          width: 8px; height: 8px;
          background: #4ade80;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,.06);
          padding: 2rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: .7rem;
          color: rgba(232,234,240,.3);
          letter-spacing: .08em;
        }
        .footer-status { display: flex; align-items: center; gap: .5rem; }
        .footer-pulse {
          width: 6px; height: 6px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: .4; transform: scale(.6); }
        }

        /* ── divider ── */
        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,.06);
          max-width: 1200px; margin: 0 auto;
        }

        /* ── keyframes ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* custom cursor */}
      <div
        className="cursor-dot"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <div
        className="cursor-ring"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <div className="pf-root">
        {/* NAV */}
        <nav className="nav">
          <span className="nav-logo">SHUBHAM.OS</span>
          <button className="nav-btn" onClick={onReturn}>
            ← TERMINAL
          </button>
        </nav>

        {/* ── HERO ── */}
        <div className="hero-wrap">
          <canvas ref={canvasRef} className="hero-canvas" />
          <span className="hero-bg-text">DEV</span>

          <div className="hero-content">
            <p className="hero-eyebrow">{"// Full Stack Engineer"}</p>
            <h1
              className="hero-name"
              style={{ transform: `translate(${px * 0.3}px, ${py * 0.2}px)` }}
            >
              <GlitchText text="SHUBHAM" />
              <br />
              <span className="hero-name-accent" style={{ fontSize: "0.55em", fontWeight: 400, letterSpacing: ".02em" }}>
                {about?.heading || "Building the web, one commit at a time."}
              </span>
            </h1>

            <p className="hero-sub">
              {about?.content
                ? about.content.split(".")[0] + "."
                : "Crafting scalable web applications, backend systems, and developer tools that ship."}
            </p>

            <div className="hero-ctas">
              <a href="#projects" className="cta-primary">View Projects</a>
              <a href="#contact" className="cta-secondary">Get in Touch</a>
            </div>
          </div>

          <div className="hero-stats">
            {projects?.length > 0 && (
              <div>
                <div className="stat-num">
                  <Counter to={projects.length} suffix="+" />
                </div>
                <div className="stat-label">Projects</div>
              </div>
            )}
            {skills?.length > 0 && (
              <div>
                <div className="stat-num">
                  <Counter to={skills.length} suffix="+" />
                </div>
                <div className="stat-label">Skills</div>
              </div>
            )}
            {experience?.length > 0 && (
              <div>
                <div className="stat-num">
                  <Counter to={experience.length} suffix="+" />
                </div>
                <div className="stat-label">Roles</div>
              </div>
            )}
          </div>
        </div>

        <hr className="divider" />

        {/* ── ABOUT ── */}
        {about && (
          <section className="section" id="about">
            <p className="section-label">About</p>
            <div className="about-grid">
              <div>
                <h2 className="about-heading">
                  {about.heading || "Who am I?"}
                </h2>
                <p className="about-text">{about.content}</p>
              </div>
              <div className="about-right">
                {[
                  { icon: "⚡", title: "Fast Delivery", desc: "Production-ready code, shipped on schedule." },
                  { icon: "🔧", title: "Full Stack", desc: "From database schema to pixel-perfect UI." },
                  { icon: "☁️", title: "Cloud Native", desc: "Scalable, containerised, cloud-first solutions." },
                  { icon: "🤝", title: "Team Player", desc: "Clean code, clear docs, collaborative workflows." },
                ].map((c) => (
                  <div className="about-card" key={c.title}>
                    <div className="about-card-icon">{c.icon}</div>
                    <div className="about-card-title">{c.title}</div>
                    <div className="about-card-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <hr className="divider" />

        {/* ── SKILLS ── */}
        {skills?.length > 0 && (
          <section className="section" id="skills">
            <p className="section-label">Skills</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: "3rem" }}>
              Technical Arsenal
            </h2>
            <div className="skills-inner" ref={skillsRef}>
              {skills.map((s, i) => (
                <SkillBar key={s.id || s.name} skill={s} index={i} inView={skillsInView} />
              ))}
            </div>
          </section>
        )}

        <hr className="divider" />

        {/* ── PROJECTS ── */}
        {projects?.length > 0 && (
          <section className="section" id="projects">
            <p className="section-label">Work</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: "3rem" }}>
              Featured Projects
            </h2>
            <div className="projects-grid">
              {projects.map((p, i) => (
                <ProjectCard key={p.id || p.title} project={p} index={i} />
              ))}
            </div>
          </section>
        )}

        <hr className="divider" />

        {/* ── EXPERIENCE ── */}
        {experience?.length > 0 && (
          <section className="section" id="experience">
            <p className="section-label">Experience</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: "3.5rem" }}>
              Where I&apos;ve Worked
            </h2>
            <div className="exp-list">
              {experience.map((e, i) => (
                <ExpItem key={e.id || e.company} exp={e} index={i} />
              ))}
            </div>
          </section>
        )}

        <hr className="divider" />

        {/* ── CONTACT ── */}
        <section className="section" id="contact">
          <p className="section-label">Contact</p>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Let&apos;s Build Together
          </h2>
          <p style={{ color: "rgba(232,234,240,.5)", fontSize: "1rem", maxWidth: 480, lineHeight: 1.7 }}>
            Open to freelance, full-time, and interesting problems. Drop a message.
          </p>

          {socials?.length > 0 && (
            <div className="contact-wrap">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill"
                >
                  <span className="social-dot" />
                  {s.platform}
                  <span style={{ color: "rgba(232,234,240,.3)", fontSize: ".72rem", fontFamily: "'Space Mono',monospace" }}>
                    ↗
                  </span>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <span>© 2025 SHUBHAM.OS — ALL RIGHTS RESERVED</span>
          <div className="footer-status">
            <div className="footer-pulse" />
            <span>AVAILABLE FOR WORK</span>
          </div>
        </footer>
      </div>
    </>
  );
}
