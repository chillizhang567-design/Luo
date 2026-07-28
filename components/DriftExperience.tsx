"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OceanScene from "./OceanScene";
import RecorderScene from "./RecorderScene";

type Chapter = "ocean" | "recorder";

export default function DriftExperience() {
  const [chapter, setChapter] = useState<Chapter>("ocean");

  return (
    <div className="drift-experience">
      <AnimatePresence mode="wait">
        {chapter === "ocean" ? (
          <motion.div
            key="ocean"
            className="chapter-frame"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <OceanScene onEnterRecorder={() => setChapter("recorder")} />
          </motion.div>
        ) : (
          <motion.div key="recorder" className="chapter-frame">
            <RecorderScene />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
