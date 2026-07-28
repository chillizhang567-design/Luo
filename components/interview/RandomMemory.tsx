"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";
import InterviewField from "./InterviewField";
import { useInterview } from "./useInterview";

function pickKey(keys: string[]): string {
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Mode A — Random Memory.
 *
 * Let chance open a door. We pick a question from a memory category
 * (childhood, places, people, turning points, forgotten moments) and
 * wander from there. "Another door" reshuffles to a fresh thread.
 */
export default function RandomMemory({ onExit }: { onExit?: () => void }) {
  const { t } = useTranslation();
  const seedKeys = useMemo(() => Object.keys(t.randomSeeds), [t]);

  // `round` forces a fresh interview body (new seed, cleared memory)
  // whenever the person asks for another door.
  const [round, setRound] = useState(0);
  const [seedKey, setSeedKey] = useState<string>(() => pickKey(seedKeys));

  const seed = t.randomSeeds[seedKey as keyof typeof t.randomSeeds];
  const tag = t.randomCategories[seedKey as keyof typeof t.randomCategories];

  const shuffle = () => {
    setSeedKey(pickKey(seedKeys));
    setRound((r) => r + 1);
  };

  return (
    <motion.div
      className="interview-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="random-bar">
        <span className="random-tag">
          {t.recorder.modeRandomTag}: {tag}
        </span>
        <button type="button" className="random-shuffle" onClick={shuffle}>
          {t.recorder.shuffle} ↻
        </button>
      </div>

      <RandomBody key={round} seed={seed} onExit={onExit} />
    </motion.div>
  );
}

function RandomBody({
  seed,
  onExit,
}: {
  seed: string;
  onExit?: () => void;
}) {
  const { t } = useTranslation();
  const interview = useInterview(seed, "random");

  return (
    <>
      <InterviewField {...interview} />
      {onExit && (
        <button type="button" className="interview-leave" onClick={onExit}>
          {t.recorder.leave}
        </button>
      )}
    </>
  );
}
