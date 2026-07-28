"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";

export type InterviewPhase = "idle" | "recording" | "responding";

type RecorderResponseProps = {
  /** The current question or response text from The Recorder. */
  text: string;
  /** Current interview phase — controls the recording indicator. */
  phase: InterviewPhase;
  /** Whether the gentle prompt system reset link is visible. */
  showResetLink: boolean;
  /** Click handler for the reset link. */
  onReset?: () => void;
  /** Visual variant — "diary" renders the words as handwriting. */
  variant?: "default" | "diary";
};

/**
 * Reveals `text` character by character, like ink appearing on the page.
 * Falls back to instant render for reduced-motion or while recording.
 */
function useTypewriter(text: string, enabled: boolean, reduceMotion: boolean) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!enabled || reduceMotion) {
      setShown(text);
      return;
    }
    setShown("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 20);
    return () => window.clearInterval(timer);
  }, [text, enabled, reduceMotion]);

  return shown;
}

export default function RecorderResponse({
  text,
  phase,
  showResetLink,
  onReset,
  variant = "default",
}: RecorderResponseProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isWaiting = phase === "recording" || phase === "responding";

  const revealed = useTypewriter(text, variant === "diary", !!reduceMotion);

  return (
    <div className={`recorder-response-wrap${variant === "diary" ? " is-diary" : ""}`}>
      <span className="question-rule" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {phase === "recording" ? (
          <motion.div
            key="recording-indicator"
            className="recording-indicator"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            aria-live="polite"
          >
            <span className="recording-dot" aria-hidden="true" />
            <span className="recording-text">{t.recorder.recording}</span>
          </motion.div>
        ) : (
          <motion.p
            key={text.slice(0, 20)}
            className="recorder-response-text"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: reduceMotion ? 0.2 : 1.2,
              ease: "easeOut",
            }}
            aria-live="polite"
          >
            {revealed.split("\n").map((line, i) => (
              <span key={i} className="question-line">
                {line}
              </span>
            ))}
            {variant === "diary" && !reduceMotion && revealed.length < text.length && (
              <span className="ink-caret" aria-hidden="true" />
            )}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResetLink && phase === "idle" && (
          <motion.button
            type="button"
            className="prompt-reset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            onClick={onReset}
          >
            &larr; try another thread
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWaiting && (
          <motion.span
            className="response-shimmer"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
