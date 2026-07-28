"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SceneConfig } from "@/sceneConfig";

type PixelOceanProps = {
  config: SceneConfig;
};

const waveBands = [
  { className: "wave-band wave-distant", distance: 10, duration: 22 },
  { className: "wave-band wave-middle", distance: -18, duration: 17 },
  { className: "wave-band wave-near", distance: 24, duration: 13 },
];

const glints = [
  { left: "9%", top: "18%", width: 44, delay: 0.4 },
  { left: "21%", top: "45%", width: 68, delay: 2.2 },
  { left: "38%", top: "27%", width: 38, delay: 1.1 },
  { left: "52%", top: "61%", width: 72, delay: 3.3 },
  { left: "67%", top: "23%", width: 52, delay: 0.8 },
  { left: "81%", top: "53%", width: 46, delay: 2.7 },
];

const perspectiveRipples = [
  { left: "6%", top: "12%", width: 42, depth: "far", delay: 0.4 },
  { left: "28%", top: "18%", width: 56, depth: "far", delay: 2.3 },
  { left: "49%", top: "9%", width: 36, depth: "far", delay: 1.1 },
  { left: "77%", top: "22%", width: 61, depth: "far", delay: 3.2 },
  { left: "14%", top: "42%", width: 88, depth: "mid", delay: 1.8 },
  { left: "38%", top: "48%", width: 112, depth: "mid", delay: 0.7 },
  { left: "69%", top: "39%", width: 96, depth: "mid", delay: 2.7 },
  { left: "86%", top: "54%", width: 74, depth: "mid", delay: 1.2 },
  { left: "2%", top: "72%", width: 146, depth: "near", delay: 2.1 },
  { left: "25%", top: "78%", width: 188, depth: "near", delay: 0.5 },
  { left: "58%", top: "68%", width: 164, depth: "near", delay: 3.1 },
  { left: "80%", top: "84%", width: 205, depth: "near", delay: 1.4 },
];

export default function PixelOcean({ config }: PixelOceanProps) {
  const reduceMotion = useReducedMotion();
  const oceanDelay = reduceMotion ? 0.2 : config.timing.ocean;

  return (
    <motion.div
      className="pixel-ocean"
      aria-hidden="true"
      initial={{ opacity: 0.22 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.3, delay: oceanDelay }}
    >
      <div className="ocean-depth-haze" />
      <div className="ocean-horizon-line" />

      {config.features.showMoonReflection && (
        <motion.div
          className="moon-reflection"
          initial={{ opacity: 0 }}
          animate={{
            opacity: reduceMotion ? 0.62 : [0.36, 0.7, 0.44],
            scaleX: reduceMotion ? 1 : [0.92, 1.08, 0.96],
          }}
          transition={{
            opacity: {
              duration: 7,
              delay: oceanDelay + 0.6,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            },
            scaleX: {
              duration: 9,
              delay: oceanDelay,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            },
          }}
        />
      )}

      {waveBands.map((wave) => (
        <motion.div
          key={wave.className}
          className={wave.className}
          animate={
            reduceMotion
              ? { x: 0, y: 0 }
              : { x: [0, wave.distance, 0], y: [0, -2, 0] }
          }
          transition={{
            duration: wave.duration,
            delay: oceanDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="ocean-glints">
        {glints.map((glint, index) => (
          <motion.span
            key={index}
            style={{ left: glint.left, top: glint.top, width: glint.width }}
            animate={
              reduceMotion
                ? { opacity: 0.34 }
                : { opacity: [0.12, 0.48, 0.18], scaleX: [0.7, 1.1, 0.8] }
            }
            transition={{
              duration: 6 + (index % 3),
              delay: oceanDelay + glint.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="perspective-ripples">
        {perspectiveRipples.map((ripple, index) => (
          <motion.span
            key={index}
            className={`perspective-ripple ripple-${ripple.depth}`}
            style={{ left: ripple.left, top: ripple.top, width: ripple.width }}
            animate={
              reduceMotion
                ? { x: 0, opacity: 0.52 }
                : {
                    x: index % 2 === 0 ? [0, 9, 0] : [0, -8, 0],
                    opacity: [0.24, 0.62, 0.3],
                    scaleX: [0.92, 1.06, 0.95],
                  }
            }
            transition={{
              duration: 7 + (index % 4),
              delay: oceanDelay + ripple.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="shore-break"
        animate={
          reduceMotion
            ? { x: 0, opacity: 0.58 }
            : { x: [-12, 10, -12], opacity: [0.42, 0.68, 0.42] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
