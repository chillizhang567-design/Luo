"use client";

import { LanguageProvider } from "./LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * App-level shell: provides the translation context and renders the
 * minimal language switch that floats above every scene.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LanguageSwitcher />
      {children}
    </LanguageProvider>
  );
}
