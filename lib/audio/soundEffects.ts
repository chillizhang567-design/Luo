"use client";

import { isSoundEnabled, resumeAudioContext } from "./context";

const lastPlayTimes = new Map<string, number>();

function throttle(key: string, ms: number): boolean {
  const now = Date.now();
  const last = lastPlayTimes.get(key) ?? 0;
  if (now - last < ms) return false;
  lastPlayTimes.set(key, now);
  return true;
}

export function playClickSound(): void {
  if (!isSoundEnabled()) return;
  if (!throttle("click", 40)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(1800, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audio.currentTime + 0.06);

  gain.gain.setValueAtTime(0.12, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(audio.currentTime);
  osc.stop(audio.currentTime + 0.1);
}

export function playHoverSound(): void {
  if (!isSoundEnabled()) return;
  if (!throttle("hover", 60)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.value = 2400;

  gain.gain.setValueAtTime(0.0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(0.03, audio.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(audio.currentTime);
  osc.stop(audio.currentTime + 0.06);
}

export function playPopSound(
  frequency: number = 600,
  volume: number = 0.15
): void {
  if (!isSoundEnabled()) return;
  if (!throttle("pop", 50)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency * 2, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(frequency, audio.currentTime + 0.1);

  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(audio.currentTime);
  osc.stop(audio.currentTime + 0.14);
}

export function playWhooshSound(
  intensity: number = 0.5
): void {
  if (!isSoundEnabled()) return;
  if (!throttle("whoosh", 80)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const dur = 0.2;
  const bufferSize = Math.floor(audio.sampleRate * dur);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    const env = Math.sin(t * Math.PI);
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(300, audio.currentTime);
  filter.frequency.exponentialRampToValueAtTime(
    600 + intensity * 2000,
    audio.currentTime + dur
  );
  filter.Q.value = 2;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(intensity * 0.2, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  source.start(audio.currentTime);
  source.stop(audio.currentTime + dur);
}

export function playSuccessSound(): void {
  if (!isSoundEnabled()) return;
  if (!throttle("success", 200)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    const start = audio.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start(start);
    osc.stop(start + 0.3);
  });
}

export function playErrorSound(): void {
  if (!isSoundEnabled()) return;
  if (!throttle("error", 200)) return;

  const audio = resumeAudioContext();
  if (!audio) return;

  const osc = audio.createOscillator();
  const osc2 = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 200;
  osc2.type = "square";
  osc2.frequency.value = 150;

  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;

  gain.gain.setValueAtTime(0.15, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.35);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(audio.currentTime);
  osc2.start(audio.currentTime);
  osc.stop(audio.currentTime + 0.4);
  osc2.stop(audio.currentTime + 0.4);
}