"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SceneConfig } from "@/sceneConfig";

type AtmosphereProps = {
  config: SceneConfig;
};

const stars = Array.from({ length: 42 }, (_, index) => ({
  left: `${4 + ((index * 23.7) % 92)}%`,
  top: `${3 + ((index * 17.9) % 43)}%`,
  size: index % 11 === 0 ? 3 : index % 4 === 0 ? 2 : 1,
  opacity: 0.32 + ((index * 13) % 50) / 100,
  delay: (index % 12) * 0.13,
}));

const fireflies = [
  { left: "7%", top: "73%", delay: 0.2, duration: 8 },
  { left: "16%", top: "83%", delay: 2.1, duration: 10 },
  { left: "26%", top: "77%", delay: 4.4, duration: 9 },
  { left: "37%", top: "88%", delay: 1.7, duration: 11 },
  { left: "61%", top: "84%", delay: 3.6, duration: 8 },
  { left: "72%", top: "76%", delay: 0.9, duration: 10 },
  { left: "84%", top: "86%", delay: 5.2, duration: 9 },
  { left: "93%", top: "72%", delay: 2.8, duration: 11 },
];

export default function Atmosphere({ config }: AtmosphereProps) {
  const reduceMotion = useReducedMotion();
  const starDelay = reduceMotion ? 0.1 : config.timing.stars;
  const fireflyDelay = reduceMotion ? 0.2 : config.timing.fireflies;

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="star-field">
        {stars.map((star, index) => (
          <motion.span
            key={index}
            className={star.size === 3 ? "star star-cross" : "star"}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: reduceMotion
                ? star.opacity
                : [star.opacity * 0.38, star.opacity, star.opacity * 0.52],
            }}
            transition={{
              duration: 4.5 + (index % 5),
              delay: starDelay + star.delay,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {config.features.showFireflies && (
        <div className="firefly-field">
          {fireflies.map((firefly, index) => (
            <motion.span
              key={index}
              className="firefly"
              style={{ left: firefly.left, top: firefly.top }}
              initial={{ opacity: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 0.58 }
                  : {
                      opacity: [0, 0.85, 0.22, 0.72, 0],
                      x: [0, 7, -4, 3, 0],
                      y: [0, -9, -15, -6, 0],
                    }
              }
              transition={{
                duration: firefly.duration,
                delay: fireflyDelay + firefly.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="film-grain" />
      <div className="pixel-scanlines" />
      <div className="cinematic-vignette" />
    </div>
  );
}
