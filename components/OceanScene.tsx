"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sceneConfig } from "@/sceneConfig";
import PixelCanvasScene from "./PixelCanvasScene";
import SoundToggle from "./SoundToggle";
import { useTranslation } from "@/components/LanguageProvider";

type OceanSceneProps = {
  onEnterRecorder?: () => void;
};

export default function OceanScene({ onEnterRecorder }: OceanSceneProps) {
  const [hasBegun, setHasBegun] = useState(false);
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const copyDelay = reduceMotion ? 0.2 : sceneConfig.timing.copy;
  const titleDelay = reduceMotion ? 0.1 : copyDelay + 0.3;
  const beginDelay = reduceMotion ? 0.2 : 1;
  const beginStory = () => {
    if (hasBegun) return;
    setHasBegun(true);
    window.setTimeout(
      () => onEnterRecorder?.(),
      reduceMotion ? 350 : 2600,
    );
  };

  return (
    <main
      className="ocean-scene canvas-ocean-scene relative isolate h-[100svh] min-h-[620px] w-screen overflow-hidden"
      data-entered={hasBegun}
    >
      <motion.div
        className="scene-camera"
        animate={
          hasBegun && !reduceMotion
            ? { scale: 1.12, x: "-1.5%", y: "-2.5%" }
            : { scale: 1, x: "0%", y: "0%" }
        }
        transition={{ duration: 4.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <PixelCanvasScene config={sceneConfig} />
      </motion.div>

      <motion.div
        className="act-transition"
        aria-hidden="true"
        animate={{ opacity: hasBegun ? 0.94 : 0 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {!hasBegun ? (
          <motion.section
            key="opening"
            className="opening-copy"
            aria-label="Drift introduction"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: copyDelay, ease: "easeOut" }}
            >
              {t.ocean.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: titleDelay, ease: "easeOut" }}
            >
              {t.ocean.title}
            </motion.h1>
            <motion.span
              className="documentary-rule"
              aria-hidden="true"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: titleDelay + 0.2 }}
            >
              <span />
            </motion.span>
          </motion.section>
        ) : (
          <motion.p
            key="entered"
            className="entered-message"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.76, y: 0 }}
            transition={{ duration: 2.4, delay: 1.2 }}
            aria-live="polite"
          >
            {t.ocean.enteredMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!hasBegun && (
          <motion.div
            className="begin-wrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 1.8, delay: beginDelay, ease: "easeOut" }}
          >
            <p className="scene-invitation">{t.ocean.subtitle}</p>
            <button
              type="button"
              className="begin-button"
              onClick={beginStory}
            >
              <span>{t.ocean.beginLabel}</span>
            </button>
            <motion.span
              className="begin-chevron"
              aria-hidden="true"
              animate={reduceMotion ? { y: 0 } : { y: [0, 3, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SoundToggle config={sceneConfig} />

      <motion.div
        className="opening-fade"
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 2, ease: "easeOut" }}
      />
    </main>
  );
}
