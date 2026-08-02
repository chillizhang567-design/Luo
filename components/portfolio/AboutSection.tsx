"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function IDBadge() {
  const lanyardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const [flipped, setFlipped] = useState(false);

  const rotateX = useTransform(sy, [-8, 8], [8, -8]);
  const rotateY = useTransform(sx, [-8, 8], [-8, 8]);

  const glossX = useTransform(sx, [-8, 8], ["10%", 90]);
  const glossY = useTransform(sy, [-8, 8], ["10%", 90]);

  const glowX = useTransform(sx, [-8, 8], ["0%", "100%"]);
  const glowY = useTransform(sy, [-8, 8], ["0%", "100%"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = lanyardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 16);
    my.set(y * -16);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const toggleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const frontGlowBg = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0.1) 40%, transparent 70%)`
  );

  const frontGlossBg = useTransform(
    [glossX, glossY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.15) 0%, transparent 60%)`
  );

  return (
    <div className="id-badge-wrap">
      <motion.div
        ref={lanyardRef}
        className="id-lanyard"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="id-glow" style={{ ["--glow-x" as any]: glowX, ["--glow-y" as any]: glowY }} />

        <div className="id-strap" />
        <div className="id-ring" />
        <div className="id-connector" />

        <motion.div
          className="id-card"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={toggleFlip}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="id-face id-face-front">
            <div className="id-header-strip">
              <span className="id-badge-id">#ID-0042</span>
            </div>

            <div className="id-avatar">
              <div className="id-avatar-inner">
                <div className="id-initials">AS</div>
              </div>
            </div>

            <div className="id-name">
              Ashutosh
              <span>Creative Developer</span>
            </div>

            <div className="id-role">Frontend Engineer</div>

            <div className="id-contact-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              hello@ashutosh.dev
            </div>

            <motion.div
              className="id-gloss"
              style={{ background: frontGlossBg, opacity: 0.6 }}
            />
          </div>

          <div className="id-face id-face-back">
            <h4>Contact Info</h4>

            <div className="id-qr">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className="id-qr-cell"
                  style={{
                    background: Math.random() > 0.5 ? "#0a0a14" : "transparent",
                  }}
                />
              ))}
            </div>

            <div className="id-info-row">
              <span className="id-info-label">Email</span>
              <span className="id-info-value">ashutosh@dev</span>
            </div>
            <div className="id-info-row">
              <span className="id-info-label">Phone</span>
              <span className="id-info-value">+91 98765 43210</span>
            </div>
            <div className="id-info-row">
              <span className="id-info-label">Location</span>
              <span className="id-info-value">Mumbai, IN</span>
            </div>
            <div className="id-info-row">
              <span className="id-info-label">Website</span>
              <span className="id-info-value">ashutosh.dev</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className="portfolio-about">
      <motion.div
        className="about-inner"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="about-label">
          <span className="about-label-num">01</span>
          <span className="about-label-text">About</span>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <h2 className="about-heading">
              I make <em>strange, useful</em> things
              <br />
              for <span className="about-accent">screen &amp; paper.</span>
            </h2>

            <div className="about-body">
              <p>
                I&apos;m a designer and illustrator working at the intersection of
                product thinking and visual storytelling. My practice moves
                between systems — design systems, product ecosystems, brand
                architectures — and the handmade: illustration, typography,
                and the occasional generative experiment.
              </p>
              <p>
                Over the past six years, I&apos;ve collaborated with startups,
                cultural institutions, and the occasional stranger on a train.
                I believe good design is a conversation, and great design is a
                conversation worth remembering.
              </p>
            </div>
          </div>

          <div className="about-meta">
            <div className="about-meta-item">
              <span className="about-meta-label">Based in</span>
              <span className="about-meta-value">Somewhere between<br />Beijing &amp; the internet</span>
            </div>
            <div className="about-meta-item">
              <span className="about-meta-label">Currently</span>
              <span className="about-meta-value">Designing dream interfaces<br />for a meditation startup</span>
            </div>
            <div className="about-meta-item">
              <span className="about-meta-label">Previously</span>
              <span className="about-meta-value">Senior Product Designer<br />@ Studio Aurora</span>
            </div>
            <div className="about-meta-item">
              <span className="about-meta-label">Say hi</span>
              <span className="about-meta-value">hello@yourstudio.com</span>
            </div>
          </div>
        </div>

        <IDBadge />
      </motion.div>
    </section>
  );
}