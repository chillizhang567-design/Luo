"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A pencil that rests on the right-hand diary page and nudges while the
 * person is writing. Purely decorative — the real input is the textarea
 * it sits over. The pen "scratch" sound is fired from the textarea's
 * keydown handler (see DiaryBook).
 */
export default function WritingAnimation({
  active,
}: {
  /** True while the field is focused and the person is writing. */
  active: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="diary-pencil"
      aria-hidden="true"
      initial={false}
      animate={
        reduceMotion
          ? { rotate: -42 }
          : active
            ? { rotate: [-40, -46, -40], y: [0, -2, 0] }
            : { rotate: -42, y: 0 }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : active
            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.6, ease: "easeOut" }
      }
    >
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <g transform="rotate(38 23 23)">
          <rect x="14" y="6" width="9" height="26" rx="2" fill="#d9a14e" />
          <rect x="14" y="6" width="9" height="26" rx="2" fill="url(#woodg)" />
          <rect x="14" y="30" width="9" height="5" fill="#b9b2a4" />
          <path d="M14 35 L18.5 44 L23 35 Z" fill="#e7c98c" />
          <path d="M18.5 38 L18.5 44 L23 35 Z" fill="#3a2a1c" />
          <rect x="13" y="4" width="11" height="3" rx="1.5" fill="#8a6a3a" />
        </g>
        <defs>
          <linearGradient id="woodg" x1="14" y1="6" x2="23" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e7b866" />
            <stop offset="1" stopColor="#c98f3f" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
