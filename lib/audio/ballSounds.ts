"use client";

import { isSoundEnabled, resumeAudioContext } from "./context";

const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];

const lastPlayTimes = new Map<string, number>();
const THROTTLE_MS = {
  connect: 24,
  bounce: 48,
  reaction: 16,
};

function throttle(key: string, ms: number): boolean {
  const now = Date.now();
  const last = lastPlayTimes.get(key) ?? 0;
  if (now - last < ms) return false;
  lastPlayTimes.set(key, now);
  return true;
}

export function playBallConnectSound(
  distance: number,
  maxDistance: number,
  paletteIndex: number
): void {
  if (!isSoundEnabled()) return;
  if (!throttle("connect", THROTTLE_MS.connect)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const proximity = 1 - distance / maxDistance;
  if (proximity < 0.15) return;

  const baseNote = PENTATONIC[paletteIndex % PENTATONIC.length];
  const freq = baseNote * (1 + proximity * 0.8);
  const volume = proximity * 0.12;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audio.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(audio.currentTime);
  osc.stop(audio.currentTime + 0.2);
}

export function playBallBounceSound(speed: number, paletteIndex: number): void {
  if (!isSoundEnabled()) return;
  if (!throttle("bounce", THROTTLE_MS.bounce)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const intensity = Math.min(speed / 5, 1);
  if (intensity < 0.05) return;

  const duration = 0.06;
  const bufferSize = Math.floor(audio.sampleRate * duration);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const decay = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * decay;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const baseNote = PENTATONIC[paletteIndex % PENTATONIC.length];
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = baseNote * 2;
  filter.Q.value = 0.7;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(intensity * 0.18, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  source.start(audio.currentTime);
  source.stop(audio.currentTime + duration);
}

export function playMouseReactionSound(force: number): void {
  if (!isSoundEnabled()) return;
  if (!throttle("reaction", THROTTLE_MS.reaction)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const f = Math.min(Math.abs(force), 1);
  if (f < 0.02) return;

  const duration = 0.12;
  const bufferSize = Math.floor(audio.sampleRate * duration);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const decay = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * decay;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 400 + f * 1200;
  filter.Q.value = 1 + f * 3;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(f * 0.15, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  source.start(audio.currentTime);
  source.stop(audio.currentTime + duration);
}