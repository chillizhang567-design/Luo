"use client";

import { useEffect, useRef } from "react";
import WaveScene from "@/components/three/WaveScene";
import { useAudioReactive } from "@/hooks/useAudioReactive";

export default function WaveDemoPage() {
  const waveRef = useRef<HTMLDivElement>(null);
  const { isActive, toggle, dispose } = useAudioReactive({ targetRef: waveRef });

  useEffect(() => {
    return () => dispose();
  }, [dispose]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a1a]">
      <WaveScene audioTargetRef={waveRef} />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-10">
        <div className="flex items-start justify-between">
          <div className="pointer-events-auto">
            <h1 className="text-2xl md:text-3xl font-light tracking-wide text-white/90">
              Resonance
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {isActive
                ? "Hover wave · bio-resonance · formant shifting · breath LFO"
                : "Click the icon to awaken"}
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full transition-all ${
                isActive
                  ? "bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.6)]"
                  : "bg-pink-400/40"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full transition-all ${
                isActive
                  ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                  : "bg-blue-400/40"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full transition-all ${
                isActive
                  ? "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]"
                  : "bg-purple-400/40"
              }`}
            />
          </div>
        </div>

        <div className="pointer-events-auto flex items-end justify-between">
          <button
            type="button"
            onClick={toggle}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition-all hover:scale-105 active:scale-95 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 ${
              isActive
                ? "border-pink-400/50 bg-pink-400/15 text-pink-200 shadow-[0_0_16px_rgba(244,114,182,0.3)]"
                : "border-white/15 bg-white/5 text-white/60"
            }`}
            aria-label={isActive ? "Mute sound" : "Enable sound"}
            aria-pressed={isActive}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isActive ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              )}
            </svg>
          </button>

          <div className="text-xs text-white/30 tracking-widest uppercase">
            Bio-Resonance · Formant Shaping · 1.2s Convolution
          </div>
        </div>
      </div>
    </div>
  );
}