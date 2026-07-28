"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FirstPersonDesk from "./recorder/FirstPersonDesk";
import ModeSelector, { type InterviewMode } from "./interview/ModeSelector";
import GuidedInterview from "./interview/GuidedInterview";
import RandomMemory from "./interview/RandomMemory";
import { useTranslation } from "@/components/LanguageProvider";

/**
 * Chapter 02 — The Recorder.
 *
 * First-person: the person is seated at a quiet desk at night. The cabin
 * scene is gone; what they see is their own diary, a pencil, a cup of tea.
 * Before the interview begins they choose a story path (ModeSelector);
 * once chosen, the matching interview mode takes over.
 */
export default function RecorderScene() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<InterviewMode | null>(null);

  const d = (seconds: number) => (reduceMotion ? 0.1 : seconds);

  return (
    <motion.main
      className="recorder-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.2 : 2.2, ease: "easeOut" }}
    >
      <motion.div
        className="recorder-camera"
        initial={reduceMotion ? false : { scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
      >
        <FirstPersonDesk />
      </motion.div>

      {/* Chapter title block — appears immediately, clearly separated. */}
      <header className="recorder-copy" aria-labelledby="recorder-title">
        <motion.p
          className="recorder-kicker"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: d(0.2) }}
        >
          {t.recorder.kicker}
        </motion.p>
        <motion.h1
          id="recorder-title"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: d(0.5), ease: "easeOut" }}
        >
          {t.recorder.title}
        </motion.h1>
        <motion.div
          className="recorder-welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: d(1) }}
        >
          <p>{t.recorder.welcome1}</p>
          <p>{t.recorder.welcome2}</p>
          <p>{t.recorder.welcome3}</p>
        </motion.div>
        <motion.p
          className="recorder-intro-question"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: d(1.6) }}
        >
          {t.recorder.introQuestion}
        </motion.p>
      </header>

      {/* Story-path choice, or the chosen interview mode. */}
      {mode === null && <ModeSelector onSelect={setMode} />}
      {mode === "guided" && <GuidedInterview onExit={() => setMode(null)} />}
      {mode === "random" && <RandomMemory onExit={() => setMode(null)} />}

      <motion.div
        className="cabin-opening-shutter"
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 2.6, ease: "easeOut" }}
      />
    </motion.main>
  );
}
