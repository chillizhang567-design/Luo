"use client";

let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }

  return ctx;
}

export function resumeAudioContext(): AudioContext | null {
  const audio = getAudioContext();
  if (!audio) return null;
  if (audio.state === "suspended") {
    void audio.resume().catch(() => undefined);
  }
  return audio;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage?.getItem("drift-sound") !== "off";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage?.setItem("drift-sound", enabled ? "on" : "off");
}