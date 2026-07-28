"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import InteractiveHeroCanvas from "./InteractiveHeroCanvas";

const SUBTITLE_TEXT = "Welcome Journey Through My Creative Portfolio";

function useTypewriter(text: string, startDelay: number = 800) {
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
      const charDuration = 55;
      const targetIndex = Math.min(
        text.length,
        Math.floor(progress / charDuration)
      );

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

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const { displayed, done } = useTypewriter(SUBTITLE_TEXT, 1000);

  return (
    <section
      ref={ref}
      className="portfolio-hero"
      style={{ minHeight: "100svh", position: "relative", overflow: "hidden" }}
    >
      <InteractiveHeroCanvas />

      <motion.div
        className="hero-content hero-content-centered"
        style={{ y, opacity, scale, position: "relative", zIndex: 10 }}
      >
        <motion.h1
          className="hero-greeting"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Hi, I&apos;m Yafei
        </motion.h1>

        <motion.p
          className="hero-typewriter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <span className="typewriter-text">{displayed}</span>
          <span className={`typewriter-cursor ${done ? "blink" : ""}`}>
            |
          </span>
        </motion.p>

        <motion.div
          className="hero-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <span>scroll</span>
          <motion.div
            className="scroll-line"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
