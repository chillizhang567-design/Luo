"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";
import DiaryBook from "@/components/recorder/DiaryBook";
import StoryMemory from "@/components/recorder/StoryMemory";
import PromptCards from "@/components/recorder/PromptCards";
import type { DoorContext, InterviewPhase } from "./useInterview";
import type { StoryMemory as StoryMemoryType } from "@/types/story";

/**
 * The shared interview surface, now seated at the desk: The Recorder's
 * words on the left page of the diary, the person's writing on the right,
 * memory doors below, and the slowly growing memory notebook to the side.
 */
export default function InterviewField({
  recorderText,
  phase,
  memories,
  doorContext,
  hasStarted,
  memory,
  setMemory,
  submit,
}: {
  recorderText: string;
  phase: InterviewPhase;
  memories: StoryMemoryType[];
  doorContext: DoorContext;
  hasStarted: boolean;
  memory: string;
  setMemory: (value: string) => void;
  submit: (answer: string) => void;
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [focusHint, setFocusHint] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoor = (question: string) => {
    setFocusHint(question);
    textareaRef.current?.focus();
  };

  const clearHint = () => setFocusHint("");

  return (
    <motion.div
      className="interview-surface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.2 : 1.4, ease: "easeOut" }}
    >
      <DiaryBook
        recorderText={recorderText}
        phase={phase}
        memory={memory}
        setMemory={setMemory}
        onSubmit={() => submit(memory)}
        focusHint={focusHint}
        onClearHint={clearHint}
        textareaRef={textareaRef}
      />

      <PromptCards
        context={doorContext}
        onDoor={handleDoor}
        visible={hasStarted}
      />

      {memories.length > 0 && (
        <motion.div
          className="story-memory-mount"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <StoryMemory memories={memories} />
        </motion.div>
      )}

      <span className="sr-only">{t.recorder.placeholder}</span>
    </motion.div>
  );
}
