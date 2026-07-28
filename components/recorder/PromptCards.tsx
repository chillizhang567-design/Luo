"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";
import { MEMORY_TYPE_META, type MemoryType } from "@/types/story";
import type { DoorContext } from "@/components/interview/useInterview";

type Door = { text: string; icon: string };

const TYPE_ORDER: MemoryType[] = [
  "place",
  "person",
  "emotion",
  "moment",
  "scene",
  "meaning",
];

/** Make a common-noun lead read naturally inside a sentence. */
function inlineLead(lead: string, isZh: boolean): string {
  const s = lead.trim();
  if (isZh) return s.replace(/^我(的)?/, "你的");
  return s
    .replace(/^my\s+/i, "your ")
    .replace(/^our\s+/i, "your ")
    .toLowerCase();
}

/**
 * Contextual "memory doors", presented as large paper notes on the desk.
 *
 * The prompts are generated from the subject the person just named — a
 * grandmother yields questions about her, a river yields questions about
 * it. They are quiet invitations, not answers. Clicking one opens a door:
 * it sets a gentle guidance hint over the diary, so the person can follow
 * that thread in their own words.
 */
export default function PromptCards({
  context,
  onDoor,
  visible,
}: {
  context: DoorContext;
  onDoor: (question: string) => void;
  visible: boolean;
}) {
  const { t, locale } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isZh = locale === "zh";

  const doors: Door[] = [];
  const used = new Set<string>();

  // 1. Contextual prompts built from the lead subject (person, place, …).
  if (context.lead && context.leadType) {
    const templates =
      (t.doorTemplates as Record<string, string[]>)[context.leadType] ?? [];
    const thing = inlineLead(context.lead, isZh);
    const icon = MEMORY_TYPE_META[context.leadType].icon;
    for (const template of templates) {
      const text = template.replace(/\{thing\}/g, thing);
      if (used.has(text)) continue;
      used.add(text);
      doors.push({ text, icon });
      if (doors.length >= 4) break;
    }
  }

  // 2. Fill any remaining slots with type-specific banks.
  if (doors.length < 4) {
    for (const type of TYPE_ORDER) {
      if (!context.types.includes(type)) continue;
      const bank = (t.doors as Record<string, string[]>)[type] ?? [];
      for (const text of bank) {
        if (used.has(text)) continue;
        used.add(text);
        doors.push({ text, icon: MEMORY_TYPE_META[type].icon });
        if (doors.length >= 4) break;
      }
      if (doors.length >= 4) break;
    }
  }

  // 3. Gentle defaults only if nothing concrete surfaced.
  for (const text of t.doorsDefault) {
    if (doors.length >= 4) break;
    if (used.has(text)) continue;
    used.add(text);
    doors.push({ text, icon: "✦" });
  }

  return (
    <div className="prompt-cards" aria-label={t.recorder.memoryDoorsHint}>
      <AnimatePresence>
        {visible && doors.length > 0 && (
          <motion.div
            key="prompt-cards-body"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: reduceMotion ? 0.2 : 1.1,
              ease: "easeOut",
            }}
          >
            <p className="prompt-cards-title">
              {t.recorder.memoryDoorsHint}
            </p>
            {context.lead && (
              <p className="prompt-cards-lead">
                {t.recorder.doorsLead.replace("{thing}", context.lead)}
              </p>
            )}
            <div className="prompt-cards-grid">
              {doors.map((door, index) => (
                <motion.button
                  key={door.text}
                  type="button"
                  className="prompt-card"
                  data-card-index={index}
                  initial={{
                    opacity: 0,
                    y: 18,
                    scale: 0.92,
                    rotate: [-2.2, 1.8, -1.1, 1.6][index % 4],
                  }}
                  animate={{
                    opacity: 1,
                    y: [0, -3, 0],
                    scale: 1,
                    rotate: [-2.2, 1.8, -1.1, 1.6][index % 4],
                  }}
                  exit={{
                    opacity: 0,
                    y: -12,
                    scale: 0.92,
                    transition: { duration: 0.5, ease: "easeIn" },
                  }}
                  transition={{
                    opacity: {
                      duration: 1,
                      delay: reduceMotion ? 0 : 0.3 + index * 0.16,
                    },
                    scale: {
                      duration: 1,
                      delay: reduceMotion ? 0 : 0.3 + index * 0.16,
                    },
                    rotate: {
                      duration: 0.7,
                      delay: reduceMotion ? 0 : 0.3 + index * 0.16,
                    },
                    y: {
                      duration: 4.4 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: reduceMotion ? 0 : 0.3 + index * 0.16,
                    },
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    y: -6,
                    filter: "brightness(1.12)",
                    transition: { duration: 0.32, ease: "easeOut" },
                  }}
                  whileFocus={{
                    scale: 1.05,
                    rotate: 0,
                    transition: { duration: 0.32, ease: "easeOut" },
                  }}
                  onClick={() => onDoor(door.text)}
                  aria-label={`${t.recorder.doorHintTitle}: ${door.text}`}
                >
                  <span className="prompt-card-icon" aria-hidden="true">
                    {door.icon}
                  </span>
                  <span className="prompt-card-text">{door.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
