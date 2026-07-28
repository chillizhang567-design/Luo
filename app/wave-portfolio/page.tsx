"use client";

import "./wave-portfolio.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import WaveScene from "@/components/three/WaveScene";
import { useAudioReactive } from "@/hooks/useAudioReactive";

const SUBTITLE_TEXT = "Wellcome Journey Through My Creative Portfolio";
const GREETING_TEXT = "Hi, I'm Yafei";

function useTypewriter(text: string, startDelay: number = 1000) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    let charIndex = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      if (elapsed < startDelay) {
        frame = requestAnimationFrame(animate);
        return;
      }
      const progress = elapsed - startDelay;
      const targetIndex = Math.min(text.length, Math.floor(progress / 55));
      if (targetIndex > charIndex) {
        charIndex = targetIndex;
        setDisplayed(text.slice(0, charIndex));
      }
      if (charIndex >= text.length) {
        setDone(true);
        return;
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [text, startDelay]);

  return { displayed, done };
}

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
];

const projects = [
  {
    id: 1,
    title: "LeetMemo",
    description: "A LeetCode companion app with smart memorization and spaced repetition.",
    year: "2025",
    color: "#1a1a3a",
    accent: "#8b5cf6",
    tags: ["Next.js", "TypeScript", "Supabase"],
  },
  {
    id: 2,
    title: "FOCUS",
    description: "Experimental typographic exploration — FOCUS / EXPLORE / BREAKTHROUGH.",
    year: "2025",
    color: "#2a2a4a",
    accent: "#ec4899",
    tags: ["Branding", "Typography"],
  },
  {
    id: 3,
    title: "Aurora Chat",
    description: "Real-time messaging app with end-to-end encryption and AI-powered replies.",
    year: "2024",
    color: "#1e1e3e",
    accent: "#06b6d4",
    tags: ["React", "WebSocket", "AI"],
  },
  {
    id: 4,
    title: "Paper Journal",
    description: "Minimalist journaling app with markdown support and cloud sync.",
    year: "2024",
    color: "#252545",
    accent: "#f59e0b",
    tags: ["Product", "Design System"],
  },
];

const aboutText = `In the digital ether, where pixels dance and code whispers, this space emerges — a sanctuary of serendipity. Here, the boundaries between art and technology dissolve, like morning mist under the sun's gentle caress. Each interaction is a ripple in the pond of consciousness, a fleeting moment where mathematics meets poetry.\n\nThis is not merely a website, but a living canvas — where ideas bloom like wildflowers in the spring, and creativity flows like a river carving its path through stone. Wander through these digital corridors, where every click is a step on a journey of discovery.`;

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 10);
    my.set(y * -10);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const rotateX = useTransform(sy, [-5, 5], [5, -5]);
  const rotateY = useTransform(sx, [-5, 5], [-5, 5]);
  const hoverLift = useTransform(sy, [-5, 5], [8, -8]);
  const hoverScale = useTransform([sx, sy], ([x, y]) => 1 + (Math.abs(x) + Math.abs(y)) * 0.004);

  const glossX = useTransform(sx, [-5, 5], ["20%", "80%"]);
  const glossY = useTransform(sy, [-5, 5], ["20%", "80%"]);
  const glossBg = useTransform(
    [glossX, glossY],
    ([x, y]) => `radial-gradient(ellipse at ${x} ${y}, ${project.accent}50 0%, transparent 50%)`
  );

  const titleX = useTransform(sx, [-5, 5], [-4, 4]);
  const titleY = useTransform(sy, [-5, 5], [-2, 2]);
  const descX = useTransform(sx, [-5, 5], [-2, 2]);
  const descY = useTransform(sy, [-5, 5], [-1.5, 1.5]);
  const tagsX = useTransform(sx, [-5, 5], [-1.5, 1.5]);

  return (
    <motion.div
      ref={cardRef}
      className="wave-project-card"
      style={{
        rotateX,
        rotateY,
        y: hoverLift,
        scale: hoverScale,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="wave-project-visual" style={{ backgroundColor: project.color }}>
        <div
          className="wave-project-accent"
          style={{ background: `linear-gradient(135deg, ${project.accent}40 0%, transparent 60%)` }}
        />
        <span className="wave-project-year">{project.year}</span>
        <motion.div
          className="wave-project-gloss"
          style={{ background: glossBg }}
        />
        <div className="wave-project-visual-overlay" />
      </div>
      <div className="wave-project-info">
        <motion.div
          className="wave-project-content-layer"
          style={{ x: titleX, y: titleY }}
        >
          <h3>{project.title}</h3>
        </motion.div>
        <motion.div
          className="wave-project-content-layer"
          style={{ x: descX, y: descY }}
        >
          <p>{project.description}</p>
        </motion.div>
        <motion.div
          className="wave-project-tags"
          style={{ x: tagsX }}
        >
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function WavePortfolioPage() {
  const waveRef = useRef<HTMLDivElement>(null);
  const { isActive, toggle, dispose } = useAudioReactive({ targetRef: waveRef });
  const { displayed: greetingText, done: greetingDone } = useTypewriter(GREETING_TEXT, 0);
  const { displayed, done } = useTypewriter(SUBTITLE_TEXT, GREETING_TEXT.length * 55 + 500);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const navBg = useTransform(scrollY, [0, 80], ["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"]);

  const layer1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const layer1Opacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);

  const layer2Scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.4]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const layer2Opacity = useTransform(scrollYProgress, [0, 1], [0.85, 0.15]);

  const layer3Scale = useTransform(scrollYProgress, [0, 1], [0.92, 0.85]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -380]);
  const layer3Opacity = useTransform(scrollYProgress, [0, 1], [0.65, 0.1]);

  const textY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const textScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  useEffect(() => {
    return () => dispose();
  }, [dispose]);

  return (
    <div className="wave-portfolio">
      <motion.div className="wave-fixed-bg" style={{ scale: bgScale }} />

      <motion.nav
        className="wave-nav"
        style={{ backgroundColor: navBg }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <a href="#home" className="wave-nav-logo">
          <span className="wave-logo-dot" />
          <span className="wave-logo-text">Yafei</span>
        </a>
        <div className="wave-nav-links">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="wave-nav-link">
              {item.label}
            </a>
          ))}
        </div>
      </motion.nav>

      <section id="home" ref={heroRef} className="wave-hero">
        <motion.div
          className="wave-parallax-layer layer-back"
          style={{ scale: layer3Scale, y: layer3Y, opacity: layer3Opacity }}
        >
          <div className="wave-fluid fluid-1">
            <div className="fluid-shape shape-a" />
            <div className="fluid-shape shape-b" />
          </div>
        </motion.div>

        <motion.div
          className="wave-parallax-layer layer-mid"
          style={{ scale: layer2Scale, y: layer2Y, opacity: layer2Opacity }}
        >
          <div className="wave-fluid fluid-2">
            <div className="fluid-shape shape-c" />
            <div className="fluid-shape shape-d" />
          </div>
        </motion.div>

        <motion.div
          className="wave-parallax-layer layer-front"
          style={{ scale: layer1Scale, y: layer1Y, opacity: layer1Opacity }}
        >
          <div ref={waveRef} className="wave-hero-wave">
            <WaveScene audioTargetRef={waveRef} />
          </div>
        </motion.div>

        <motion.div
          className="wave-hero-overlay"
          style={{ y: textY, scale: textScale, opacity: textOpacity }}
        >
          <motion.div
            className="wave-hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="wave-hero-greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="tw-text">{greetingText}</span>
              {!greetingDone && <span className="tw-cursor">|</span>}
            </motion.h1>

            <motion.p
              className="wave-hero-typewriter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <span className="tw-text">{displayed}</span>
              <span className={`tw-cursor ${done ? "blink" : ""}`}>|</span>
            </motion.p>
          </motion.div>

          <div className="wave-bottom-icons">
            <button className="wave-icon-btn" aria-label="Layout view">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggle}
              className={`wave-icon-btn sound-btn outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 ${isActive ? "active" : ""}`}
              aria-label={isActive ? "Mute sound" : "Enable sound"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {isActive ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
            </button>
            <a href="mailto:hello@yafei.studio" className="wave-icon-btn" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
            <a href="#" className="wave-icon-btn" aria-label="More">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </a>
          </div>
        </motion.div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      <section id="about" className="wave-section wave-about-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="wave-about-title">About Me</h2>

          <motion.div
            className="wave-about-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {aboutText.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section id="projects" className="wave-section wave-projects-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="wave-projects-title">Projects</h2>

          <div className="wave-projects-list">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </motion.div>
      </section>

      <section id="resume" className="wave-section wave-resume-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="wave-resume-title">Get in Touch</h2>
          <p className="wave-resume-desc">
            I&apos;m always interested in thoughtful collaborations — product design,
            brand identity, illustration commissions, or just a good conversation
            about design.
          </p>
          <div className="wave-resume-links">
            <a href="mailto:hello@yafei.studio" className="wave-resume-link">
              <span>Email</span>
              <span>hello@yafei.studio</span>
              <span>→</span>
            </a>
            <a href="#" className="wave-resume-link">
              <span>Instagram</span>
              <span>@yafei.design</span>
              <span>→</span>
            </a>
            <a href="#" className="wave-resume-link">
              <span>Dribbble</span>
              <span>yiwen</span>
              <span>→</span>
            </a>
          </div>
          <div className="wave-footer">
            <p>© 2025 Yafei. Crafted with care.</p>
            <p className="wave-footer-available">
              <span className="wave-dot" />
              Available for new work
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
