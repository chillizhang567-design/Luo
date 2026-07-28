"use client";

import { isSoundEnabled, resumeAudioContext } from "./context";

let lastPlay = 0;

export function playPenSound(): void {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;

  const now = Date.now();
  if (now - lastPlay < 38) return;
  lastPlay = now;

  const audio = resumeAudioContext();
  if (!audio) return;

  const start = audio.currentTime;
  const duration = 0.045;

  const bufferSize = Math.floor(audio.sampleRate * duration);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    const decay = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * decay;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1700 + Math.random() * 1300;
  band.Q.value = 0.7;

  const gain = audio.createGain();
  gain.gain.value = 0.045;

  source.connect(band);
  band.connect(gain);
  gain.connect(audio.destination);

  source.start(start);
  source.stop(start + duration);
}