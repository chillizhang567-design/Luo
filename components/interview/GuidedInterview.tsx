"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";
import InterviewField from "./InterviewField";
import { useInterview } from "./useInterview";

/**
 * Mode B — Guided Interview.
 *
 * A documentary-style conversation. The Recorder leads scene → memory →
 * emotion → meaning, opening with the classic first-scene question.
 */
export default function GuidedInterview({
  onExit,
}: {
  onExit?: () => void;
}) {
  const { t } = useTranslation();
  const interview = useInterview(t.recorder.openingQuestion, "guided");

  return (
    <motion.div
      className="interview-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <InterviewField {...interview} />
      {onExit && (
        <button type="button" className="interview-leave" onClick={onExit}>
          {t.recorder.leave}
        </button>
      )}
    </motion.div>
  );
}
