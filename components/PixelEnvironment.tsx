"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SceneConfig } from "@/sceneConfig";

type PixelEnvironmentProps = {
  config: SceneConfig;
};

const clouds = [
  { className: "pixel-cloud cloud-one", distance: 18, duration: 48 },
  { className: "pixel-cloud cloud-two", distance: -16, duration: 55 },
  { className: "pixel-cloud cloud-three", distance: 12, duration: 62 },
  { className: "pixel-cloud cloud-four", distance: -10, duration: 51 },
];

const flowers = [
  { left: "3%", bottom: "9%", color: "cream", size: "large" },
  { left: "8%", bottom: "17%", color: "rose", size: "small" },
  { left: "11%", bottom: "4%", color: "violet", size: "large" },
  { left: "14%", bottom: "6%", color: "gold", size: "small" },
  { left: "19%", bottom: "14%", color: "violet", size: "large" },
  { left: "23%", bottom: "22%", color: "cream", size: "small" },
  { left: "28%", bottom: "4%", color: "cream", size: "small" },
  { left: "33%", bottom: "18%", color: "rose", size: "small" },
  { left: "39%", bottom: "6%", color: "gold", size: "large" },
  { left: "61%", bottom: "4%", color: "cream", size: "large" },
  { left: "68%", bottom: "8%", color: "gold", size: "small" },
  { left: "73%", bottom: "17%", color: "violet", size: "large" },
  { left: "78%", bottom: "5%", color: "cream", size: "small" },
  { left: "84%", bottom: "15%", color: "rose", size: "large" },
  { left: "88%", bottom: "23%", color: "gold", size: "small" },
  { left: "90%", bottom: "7%", color: "violet", size: "small" },
  { left: "95%", bottom: "18%", color: "cream", size: "large" },
  { left: "98%", bottom: "3%", color: "rose", size: "small" },
];

const grasses = Array.from({ length: 54 }, (_, index) => ({
  left: `${(index * 7.3) % 100}%`,
  bottom: `${2 + ((index * 7) % 17)}%`,
  height: 12 + ((index * 11) % 22),
  delay: (index % 8) * 0.35,
}));

const beachStones = Array.from({ length: 18 }, (_, index) => ({
  left: `${3 + ((index * 13.7) % 94)}%`,
  top: `${26 + ((index * 19) % 56)}%`,
  size: 2 + (index % 4),
  opacity: 0.22 + (index % 3) * 0.1,
}));

export default function PixelEnvironment({ config }: PixelEnvironmentProps) {
  const reduceMotion = useReducedMotion();
  const moonDelay = reduceMotion ? 0.2 : config.timing.moon;

  return (
    <>
      <div className="sky-depth" aria-hidden="true" />

      {config.features.showClouds && (
        <div className="cloud-layer" aria-hidden="true">
          {clouds.map((cloud) => (
            <motion.div
              key={cloud.className}
              className={cloud.className}
              animate={reduceMotion ? { x: 0 } : { x: [0, cloud.distance, 0] }}
              transition={{
                duration: cloud.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span />
              <span />
              <span />
            </motion.div>
          ))}
        </div>
      )}

      {config.features.showMoon && (
        <motion.div
          className="moon-system"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.6, delay: moonDelay, ease: "easeOut" }}
        >
          <div className="moon-aura moon-aura-wide" />
          <div className="moon-aura moon-aura-near" />
          <div className="pixel-moon">
            <span className="crater crater-one" />
            <span className="crater crater-two" />
            <span className="crater crater-three" />
            <span className="crater crater-four" />
          </div>
        </motion.div>
      )}

      <div className="horizon-islands" aria-hidden="true">
        <div className="island island-left" />
        <div className="island island-right" />
        <div className="island island-far" />
      </div>

      {config.features.showLighthouse && (
        <div className="lighthouse-coast" aria-label="A distant lighthouse">
          <div className="coast-trees">
            <span />
            <span />
            <span />
          </div>
          <div className="keeper-house">
            <span className="house-roof" />
            <span className="house-window" />
          </div>
          <div className="lighthouse">
            <div className="lighthouse-roof" />
            <motion.div
              className="lighthouse-lamp"
              animate={
                reduceMotion
                  ? { opacity: 0.9 }
                  : { opacity: [0.68, 1, 0.72], boxShadow: ["0 0 8px #f8c66c", "0 0 20px #ffd98c", "0 0 8px #f8c66c"] }
              }
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="lighthouse-gallery" />
            <div className="lighthouse-tower">
              <span />
              <span />
            </div>
          </div>
          <div className="coast-rocks" />
        </div>
      )}

      <div className="beach-middle" aria-hidden="true">
        <div className="wet-sand-sheen" />
        <div className="beach-stones">
          {beachStones.map((stone, index) => (
            <span
              key={index}
              style={{
                left: stone.left,
                top: stone.top,
                width: stone.size,
                height: Math.max(2, stone.size - 1),
                opacity: stone.opacity,
              }}
            />
          ))}
        </div>
      </div>

      <div className="foreground-meadow" aria-hidden="true">
        <div className="meadow-light" />
        <div className="shore-path" />

        <div className="grass-field">
          {grasses.map((grass, index) => (
            <motion.span
              key={index}
              style={{
                left: grass.left,
                bottom: grass.bottom,
                height: grass.height,
              }}
              animate={
                reduceMotion ? { rotate: 0 } : { rotate: [-3, 4, -3] }
              }
              transition={{
                duration: 4.8 + (index % 4),
                delay: grass.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {config.features.showFlowers && (
          <div className="flower-field">
            {flowers.map((flower, index) => (
              <motion.div
                key={index}
                className={`wildflower flower-${flower.color} flower-${flower.size}`}
                style={{ left: flower.left, bottom: flower.bottom }}
                animate={
                  reduceMotion
                    ? { rotate: 0 }
                    : { rotate: [-2, 3, -2], y: [0, -1, 0] }
                }
                transition={{
                  duration: 5 + (index % 3),
                  delay: index * 0.24,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="petal petal-a" />
                <span className="petal petal-b" />
                <span className="petal petal-c" />
                <span className="petal petal-d" />
                <span className="flower-heart" />
              </motion.div>
            ))}
          </div>
        )}

        {config.features.showLantern && (
          <div className="pixel-lantern">
            <div className="lantern-handle" />
            <div className="lantern-cap" />
            <motion.div
              className="lantern-light"
              animate={
                reduceMotion
                  ? { opacity: 0.88 }
                  : { opacity: [0.72, 1, 0.8], scale: [0.98, 1.03, 0.98] }
              }
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="lantern-base" />
          </div>
        )}

        {config.features.showAnimals && (
          <>
            <motion.div
              className="sleeping-cat"
              aria-label="A small sleeping cat"
              animate={
                reduceMotion ? { scaleY: 1 } : { scaleY: [1, 1.025, 1] }
              }
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="cat-body" />
              <span className="cat-head" />
              <span className="cat-ear cat-ear-left" />
              <span className="cat-ear cat-ear-right" />
              <span className="cat-tail" />
            </motion.div>

            <motion.div
              className="pixel-rabbit"
              aria-label="A small rabbit watching the sea"
              animate={reduceMotion ? { y: 0 } : { y: [0, -1, 0] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="rabbit-body" />
              <span className="rabbit-head" />
              <span className="rabbit-ear rabbit-ear-left" />
              <span className="rabbit-ear rabbit-ear-right" />
              <span className="rabbit-tail" />
              <span className="rabbit-eye" />
            </motion.div>
          </>
        )}
      </div>
    </>
  );
}
