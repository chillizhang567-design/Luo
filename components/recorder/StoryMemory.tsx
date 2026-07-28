"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MEMORY_TYPE_META, type StoryMemory as StoryMemoryType } from "@/types/story";
import { useTranslation } from "@/components/LanguageProvider";

type StoryMemoryProps = {
  memories: StoryMemoryType[];
};

export default function StoryMemory({ memories }: StoryMemoryProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  if (memories.length === 0) return null;

  return (
    <motion.section
      className="story-memory"
      aria-label={t.recorder.memoriesFound}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.2 : 1.6, ease: "easeOut" }}
    >
      <motion.p
        className="story-memory-header"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ duration: 1.2, delay: reduceMotion ? 0.1 : 0.4 }}
      >
        {t.recorder.memoriesFound}
      </motion.p>

      <div className="story-memory-list">
        <AnimatePresence>
          {memories.map((memory, index) => {
            const meta = MEMORY_TYPE_META[memory.type];
            return (
              <motion.div
                key={memory.id}
                className="memory-entry"
                layout
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.92,
                  transition: { duration: 0.4 },
                }}
                transition={{
                  duration: reduceMotion ? 0.2 : 1.0,
                  ease: "easeOut",
                  delay: reduceMotion ? 0 : 0.15,
                }}
              >
                <span className="memory-entry-icon" aria-hidden="true">
                  {meta.icon}
                </span>
                <div className="memory-entry-body">
                  <span className="memory-entry-value">{memory.value}</span>
                  <span className="memory-entry-type">{meta.label}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
