"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SceneConfig } from "@/sceneConfig";

type SoundToggleProps = {
  config: SceneConfig;
};

export default function SoundToggle({ config }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const nodes = audioRefs.current;
    return () => {
      nodes.forEach((audio) => {
        audio?.pause();
      });
    };
  }, []);

  async function toggleSound() {
    if (isMuted) {
      try {
        await Promise.all(
          audioRefs.current.map(async (audio, index) => {
            if (!audio) return;
            audio.volume = config.audio[index].volume;
            await audio.play();
          }),
        );
        setIsMuted(false);
        setIsUnavailable(false);
      } catch {
        audioRefs.current.forEach((audio) => audio?.pause());
        setIsUnavailable(true);
      }
      return;
    }

    audioRefs.current.forEach((audio) => audio?.pause());
    setIsMuted(true);
  }

  return (
    <>
      {config.audio.map((track, index) => (
        <audio
          key={track.id}
          ref={(node) => {
            audioRefs.current[index] = node;
          }}
          src={track.src}
          loop
          preload="none"
        />
      ))}

      <motion.button
        type="button"
        className="sound-toggle"
        aria-label={isMuted ? "Play ambient sound" : "Mute ambient sound"}
        aria-pressed={!isMuted}
        title={isUnavailable ? "Ambient audio is unavailable" : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: reduceMotion ? 0.2 : 10.4 }}
        onClick={toggleSound}
      >
        <span className="sound-icon" aria-hidden="true">
          <span className="speaker-body" />
          <span className="speaker-cone" />
          {!isMuted && (
            <>
              <span className="sound-wave sound-wave-one" />
              <span className="sound-wave sound-wave-two" />
            </>
          )}
          {isMuted && <span className="sound-slash" />}
        </span>
        <span className="sound-label">
          {isUnavailable ? "sound unavailable" : isMuted ? "sound off" : "sound on"}
        </span>
      </motion.button>
    </>
  );
}
