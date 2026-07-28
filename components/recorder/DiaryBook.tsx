"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";
import RecorderResponse from "./RecorderResponse";
import WritingAnimation from "./WritingAnimation";
import { playPenSound } from "@/lib/audio/penSound";
import type { InterviewPhase } from "@/components/interview/useInterview";

type DiaryBookProps = {
  recorderText: string;
  phase: InterviewPhase;
  memory: string;
  setMemory: (value: string) => void;
  onSubmit: () => void;
  focusHint: string;
  onClearHint: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

/**
 * The open diary on the desk. The left page holds The Recorder's words;
 * the right page is where the person writes their own. The pencil rests
 * over the right page and the desk reacts faintly as they type.
 */
export default function DiaryBook({
  recorderText,
  phase,
  memory,
  setMemory,
  onSubmit,
  focusHint,
  onClearHint,
  textareaRef,
}: DiaryBookProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const disabled = phase !== "idle";

  // Transient "writing" pulse: true for a short beat after each keystroke,
  // so the pencil moves *as* the person writes rather than continuously.
  const [isWriting, setIsWriting] = useState(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, []);

  const markWriting = () => {
    setIsWriting(true);
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => setIsWriting(false), 480);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
      return;
    }
    // A character or delete: pencil scratches, paper sounds, pencil nudges.
    if (event.key.length === 1 || event.key === "Backspace") {
      playPenSound();
      markWriting();
    }
  };

  return (
    <section className="diary" aria-label="The Recorder's diary">
      <span className="diary-binding" aria-hidden="true" />

      <div className="diary-page diary-page-left">
        <span className="diary-page-label">{t.recorder.title}</span>
        <div className="diary-left-body">
          <RecorderResponse
            text={recorderText}
            phase={phase}
            showResetLink={false}
            variant="diary"
          />
        </div>
      </div>

      <div className="diary-page diary-page-right">
        <span className="diary-page-label">{t.recorder.yourWords}</span>

        <AnimatePresence>
          {focusHint && (
            <motion.span
              className="diary-door-hint"
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={onClearHint}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClearHint();
                }
              }}
              aria-label={focusHint}
            >
              <span className="diary-door-hint-text">{focusHint}</span>
              <span className="diary-door-clear" aria-hidden="true">
                ×
              </span>
            </motion.span>
          )}
        </AnimatePresence>

        <textarea
          ref={textareaRef}
          className="diary-textarea"
          value={memory}
          onChange={(event) => setMemory(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.recorder.placeholder}
          maxLength={1200}
          disabled={disabled}
          aria-label={t.recorder.placeholder}
        />

        <WritingAnimation active={!disabled && isWriting} />

        <span className="diary-caret" aria-hidden="true">
          {disabled
            ? ""
            : memory.trim().length > 0
              ? t.recorder.caretReady
              : t.recorder.caretIdle}
        </span>
      </div>
    </section>
  );
}
