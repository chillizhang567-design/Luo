"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";
import { MEMORY_TYPE_META, type MemoryType } from "@/types/story";
import type { DoorContext } from "./useInterview";

type Door = { text: string; icon: string };

const TYPE_ORDER: MemoryType[] = [
  "place",
  "person",
  "emotion",
  "moment",
  "scene",
  "meaning",
];

/**
 * Persistent "memory doors".
 *
 * Not suggested answers — quiet invitations that appear after every
 * Recorder response. Clicking one does NOT write into the textarea;
 * it only opens a door (focuses the field with a faint hint), leaving
 * the person free to tell their own story.
 */
export default function GentlePrompts({
  context,
  onDoor,
  visible,
}: {
  context: DoorContext;
  onDoor: (question: string) => void;
  visible: boolean;
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  // Build up to four doors: type-specific first, then generic fillers.
  const doors: Door[] = [];
  const used = new Set<string>();

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

  for (const text of t.doorsDefault) {
    if (used.has(text)) continue;
    used.add(text);
    doors.push({ text, icon: "✦" });
    if (doors.length >= 4) break;
  }

  return (
    <div className="gentle-prompts" aria-label={t.recorder.memoryDoorsHint}>
      <AnimatePresence>
        {visible && doors.length > 0 && (
          <motion.div
            key="gentle-body"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: reduceMotion ? 0.2 : 1.2,
              ease: "easeOut",
            }}
          >
            <p className="gentle-prompts-label">
              {t.recorder.memoryDoorsHint}
            </p>
            {context.lead && (
              <p className="gentle-prompts-lead">
                {t.recorder.doorsLead.replace(
                  "{thing}",
                  context.lead,
                )}
              </p>
            )}
            <div className="gentle-prompt-cards">
              {doors.map((door, index) => (
                <motion.button
                  key={door.text}
                  type="button"
                  className="gentle-door"
                  data-door-index={index}
                  initial={{
                    opacity: 0,
                    y: 14,
                    scale: 0.9,
                    rotate: [-2.4, 2, -1.2, 1.8][index % 4],
                  }}
                  animate={{
                    opacity: 1,
                    y: [0, -2.5, 0],
                    scale: 1,
                    rotate: [-2.4, 2, -1.2, 1.8][index % 4],
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
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
                      duration: 4.2 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: reduceMotion ? 0 : 0.3 + index * 0.16,
                    },
                  }}
                  whileHover={{
                    scale: 1.06,
                    rotate: 0,
                    filter: "brightness(1.12)",
                    transition: { duration: 0.32, ease: "easeOut" },
                  }}
                  whileFocus={{
                    scale: 1.06,
                    rotate: 0,
                    transition: { duration: 0.32, ease: "easeOut" },
                  }}
                  onClick={() => onDoor(door.text)}
                  aria-label={`${t.recorder.doorHintTitle}: ${door.text}`}
                >
                  <span className="gentle-door-icon" aria-hidden="true">
                    {door.icon}
                  </span>
                  <span className="gentle-door-text">{door.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
