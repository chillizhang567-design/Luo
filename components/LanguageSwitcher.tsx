"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation, type Locale } from "./LanguageProvider";

/**
 * A minimal, cinematic language switch.
 *
 * No dropdown, no flags. Just a single 🌐 glyph that breathes in the
 * corner and opens a quiet panel of two words.
 */
export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const options: Locale[] = ["en", "zh"];

  return (
    <div className="language-switcher">
      <motion.button
        type="button"
        className="lang-toggle"
        aria-label={t.language.label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <span className="lang-glyph" aria-hidden="true">
          🌐
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lang-panel"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{
              duration: reduceMotion ? 0.15 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="menu"
          >
            {options.map((opt) => {
              const active = opt === locale;
              return (
                <motion.button
                  key={opt}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  className={`lang-option${active ? " is-active" : ""}`}
                  onClick={() => {
                    setLocale(opt);
                    setOpen(false);
                  }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.25 }}
                >
                  {t.language[opt]}
                  {active && (
                    <span className="lang-dot" aria-hidden="true" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
