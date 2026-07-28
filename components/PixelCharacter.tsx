"use client";

import { motion, useReducedMotion } from "framer-motion";

type PixelCharacterProps = {
  delay?: number;
};

export default function PixelCharacter({ delay = 5 }: PixelCharacterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="img"
      aria-label="The protagonist, seen from behind, sitting with raised knees and watching the ocean"
      className="rear-character"
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: reduceMotion ? 0 : [0, -2, 0],
        scaleY: reduceMotion ? 1 : [1, 1.008, 1],
      }}
      transition={{
        opacity: {
          duration: 2.4,
          delay: reduceMotion ? 0.2 : delay,
          ease: "easeOut",
        },
        y: {
          duration: 6.8,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        scaleY: {
          duration: 6.8,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <div className="rear-shadow" />
      <div className="character-rim-light" />

      <div className="rear-head">
        <span className="hair-crown" />
        <span className="hair-side hair-side-left" />
        <span className="hair-side hair-side-right" />
        <span className="visible-ear" />
      </div>
      <div className="rear-neck" />

      <div className="rear-coat">
        <span className="coat-collar coat-collar-left" />
        <span className="coat-collar coat-collar-right" />
        <span className="coat-seam" />
        <span className="coat-warm-edge" />
      </div>

      <div className="rear-arm rear-arm-left">
        <span className="rear-hand rear-hand-left" />
      </div>
      <div className="rear-arm rear-arm-right">
        <span className="rear-hand rear-hand-right" />
      </div>

      <div className="seated-hips" />
      <div className="raised-leg raised-leg-left">
        <span className="raised-knee raised-knee-left" />
      </div>
      <div className="raised-leg raised-leg-right">
        <span className="raised-knee raised-knee-right" />
      </div>
      <div className="lower-leg lower-leg-left" />
      <div className="lower-leg lower-leg-right" />
      <div className="rear-boot rear-boot-left" />
      <div className="rear-boot rear-boot-right" />
    </motion.div>
  );
}
