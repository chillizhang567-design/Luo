"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";

export type InterviewMode = "guided" | "random";

/**
 * The opening choice — "How would you like to begin?"
 *
 * Two story paths, not a settings menu. Each card is a quiet invitation
 * rather than a button.
 */
export default function ModeSelector({
  onSelect,
}: {
  onSelect: (mode: InterviewMode) => void;
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const cards: {
    mode: InterviewMode;
    icon: string;
    title: string;
    desc: string;
  }[] = [
    {
      mode: "random",
      icon: "🍾",
      title: t.recorder.modeRandomTitle,
      desc: t.recorder.modeRandomDesc,
    },
    {
      mode: "guided",
      icon: "🎙",
      title: t.recorder.modeGuidedTitle,
      desc: t.recorder.modeGuidedDesc,
    },
  ];

  return (
    <motion.section
      className="mode-selector"
      aria-label={t.recorder.modeTitle}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0.2 : 2,
        delay: reduceMotion ? 0 : 1.4,
        ease: "easeOut",
      }}
    >
      <motion.p
        className="mode-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0.2 : 1.6,
          delay: reduceMotion ? 0 : 1.8,
        }}
      >
        {t.recorder.modeTitle}
      </motion.p>
      <motion.p
        className="mode-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.62 }}
        transition={{
          duration: reduceMotion ? 0.2 : 1.6,
          delay: reduceMotion ? 0 : 2.2,
        }}
      >
        {t.recorder.modeSubtitle}
      </motion.p>

      <div className="mode-cards">
        {cards.map((card, index) => (
          <motion.button
            key={card.mode}
            type="button"
            className="mode-card"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0.2 : 1.4,
              delay: reduceMotion ? 0 : 2.4 + index * 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              scale: 1.03,
              y: -4,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            whileFocus={{
              scale: 1.03,
              y: -4,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            onClick={() => onSelect(card.mode)}
          >
            <span className="mode-card-icon" aria-hidden="true">
              {card.icon}
            </span>
            <span className="mode-card-title">{card.title}</span>
            <span className="mode-card-desc">{card.desc}</span>
            <span className="mode-card-rule" aria-hidden="true" />
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
