"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * duration);
  const buffer = ctx.createBuffer(1, length, rate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createBioImpulse(ctx: AudioContext): AudioBuffer {
  const rate = ctx.sampleRate;
  const duration = 1.2;
  const length = Math.floor(rate * duration);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const channel = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
    }
  }
  return impulse;
}

interface UseAudioReactiveOptions {
  targetRef?: RefObject<HTMLElement>;
}

export function useAudioReactive(options?: UseAudioReactiveOptions) {
  const ctxRef = useRef<AudioContext | null>(null);

  const coreOscRef = useRef<OscillatorNode | null>(null);
  const coreGainRef = useRef<GainNode | null>(null);

  const harmOscRef = useRef<OscillatorNode | null>(null);
  const harmGainRef = useRef<GainNode | null>(null);

  const formant1Ref = useRef<BiquadFilterNode | null>(null);
  const formant2Ref = useRef<BiquadFilterNode | null>(null);
  const formant3Ref = useRef<BiquadFilterNode | null>(null);

  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseFilterRef = useRef<BiquadFilterNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  const masterEnvRef = useRef<GainNode | null>(null);

  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const fbRef = useRef<GainNode | null>(null);

  const pointerOverRef = useRef(false);
  const mouseHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const enterHandlerRef = useRef<(() => void) | null>(null);
  const leaveHandlerRef = useRef<(() => void) | null>(null);

  const [isActive, setIsActive] = useState(false);

  const smoothSet = useCallback(
    (param: AudioParam, target: number, now: AudioTimestamp, slide: number) => {
      param.cancelScheduledValues(now);
      param.setValueAtTime(param.value, now);
      param.linearRampToValueAtTime(target, now + slide);
    },
    []
  );

  const openMasterEnv = useCallback((ctxNow: AudioContext) => {
    const env = masterEnvRef.current;
    if (!env) return;
    env.gain.cancelScheduledValues(ctxNow);
    env.gain.setValueAtTime(env.gain.value, ctxNow);
    env.gain.linearRampToValueAtTime(0.48, ctxNow + 0.2);
  }, []);

  const closeMasterEnv = useCallback((ctxNow: AudioContext) => {
    const env = masterEnvRef.current;
    if (!env) return;
    env.gain.cancelScheduledValues(ctxNow);
    env.gain.setValueAtTime(env.gain.value, ctxNow);
    env.gain.exponentialRampToValueAtTime(0.0001, ctxNow + 1.5);
  }, []);

  const ensureContext = useCallback(() => {
    if (ctxRef.current) return;

    const ctx = new AudioContext();

    const masterEnv = ctx.createGain();
    masterEnv.gain.value = 0;

    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.7;
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.3;

    const convolver = ctx.createConvolver();
    convolver.buffer = createBioImpulse(ctx);

    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.25;
    const fb = ctx.createGain();
    fb.gain.value = 0.12;

    const coreOsc = ctx.createOscillator();
    coreOsc.type = "sine";
    coreOsc.frequency.value = 82.41;
    coreOsc.detune.value = 1;

    const coreGain = ctx.createGain();
    coreGain.gain.value = 0.1;

    const harmOsc = ctx.createOscillator();
    harmOsc.type = "sine";
    harmOsc.frequency.value = 246.94;
    harmOsc.detune.value = -1;
    const harmGain = ctx.createGain();
    harmGain.gain.value = 0.06;

    const formant1 = ctx.createBiquadFilter();
    formant1.type = "bandpass";
    formant1.frequency.value = 180;
    formant1.Q.value = 5;

    const formant2 = ctx.createBiquadFilter();
    formant2.type = "bandpass";
    formant2.frequency.value = 550;
    formant2.Q.value = 4;

    const formant3 = ctx.createBiquadFilter();
    formant3.type = "bandpass";
    formant3.frequency.value = 1100;
    formant3.Q.value = 3;

    const noiseBuffer = createNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 600;
    noiseFilter.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.12;

    coreOsc.connect(coreGain);
    harmOsc.connect(harmGain);

    coreGain.connect(formant1);
    coreGain.connect(formant2);
    harmGain.connect(formant2);
    harmGain.connect(formant3);

    formant1.connect(masterEnv);
    formant2.connect(masterEnv);
    formant3.connect(masterEnv);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterEnv);

    masterEnv.connect(dryGain);
    masterEnv.connect(wetGain);

    wetGain.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(ctx.destination);
    wetGain.connect(ctx.destination);

    coreOsc.start();
    harmOsc.start();
    noiseSource.start();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!pointerOverRef.current) return;

      const cg = coreGainRef.current;
      const hg = harmGainRef.current;
      const f1 = formant1Ref.current;
      const f2 = formant2Ref.current;
      const f3 = formant3Ref.current;
      const ng = noiseGainRef.current;
      const nf = noiseFilterRef.current;
      const ctx2 = ctxRef.current;
      if (!cg || !hg || !f1 || !f2 || !f3 || !ng || !nf || !ctx2) return;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const now = ctx2.currentTime;
      const slide = 0.1;

      smoothSet(cg.gain, 0.06 + (1 - y) * 0.1, now, slide);
      smoothSet(hg.gain, 0.02 + (1 - y) * 0.1, now, slide);

      smoothSet(f1.frequency, 120 + x * 200, now, slide);
      smoothSet(f1.Q, 2 + y * 3, now, slide);

      smoothSet(f2.frequency, 350 + x * 500, now, slide);
      smoothSet(f2.Q, 3 + y * 4, now, slide);

      smoothSet(f3.frequency, 700 + x * 900, now, slide);
      smoothSet(f3.Q, 2 + y * 3, now, slide);

      smoothSet(ng.gain, 0.06 + (1 - y) * 0.14, now, slide);
      smoothSet(nf.frequency, 300 + x * 400, now, slide);
    };

    mouseHandlerRef.current = handleMouseMove;
    window.addEventListener("mousemove", handleMouseMove);

    ctxRef.current = ctx;
    coreOscRef.current = coreOsc;
    coreGainRef.current = coreGain;
    harmOscRef.current = harmOsc;
    harmGainRef.current = harmGain;
    formant1Ref.current = formant1;
    formant2Ref.current = formant2;
    formant3Ref.current = formant3;
    noiseSourceRef.current = noiseSource;
    noiseFilterRef.current = noiseFilter;
    noiseGainRef.current = noiseGain;
    masterEnvRef.current = masterEnv;
    dryGainRef.current = dryGain;
    wetGainRef.current = wetGain;
    convolverRef.current = convolver;
    delayRef.current = delay;
    fbRef.current = fb;
  }, [smoothSet]);

  useEffect(() => {
    const target = options?.targetRef?.current;
    if (!target) return;

    const handleEnter = () => {
      pointerOverRef.current = true;
      if (isActive && ctxRef.current) {
        openMasterEnv(ctxRef.current.currentTime);
      }
    };

    const handleLeave = () => {
      pointerOverRef.current = false;
      if (ctxRef.current) {
        closeMasterEnv(ctxRef.current.currentTime);
      }
    };

    enterHandlerRef.current = handleEnter;
    leaveHandlerRef.current = handleLeave;

    target.addEventListener("mouseenter", handleEnter);
    target.addEventListener("mouseleave", handleLeave);
    target.addEventListener("touchstart", handleEnter, { passive: true });
    target.addEventListener("touchend", handleLeave);

    return () => {
      target.removeEventListener("mouseenter", handleEnter);
      target.removeEventListener("mouseleave", handleLeave);
      target.removeEventListener("touchstart", handleEnter);
      target.removeEventListener("touchend", handleLeave);
      enterHandlerRef.current = null;
      leaveHandlerRef.current = null;
    };
  }, [options?.targetRef, isActive, openMasterEnv, closeMasterEnv]);

  const toggle = useCallback(() => {
    ensureContext();
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (!isActive) {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      setIsActive(true);
      if (pointerOverRef.current) {
        openMasterEnv(ctx.currentTime);
      }
    } else {
      setIsActive(false);
      closeMasterEnv(ctx.currentTime);
    }
  }, [isActive, ensureContext, openMasterEnv, closeMasterEnv]);

  const dispose = useCallback(() => {
    if (mouseHandlerRef.current) {
      window.removeEventListener("mousemove", mouseHandlerRef.current);
      mouseHandlerRef.current = null;
    }

    const target = options?.targetRef?.current;
    if (target && enterHandlerRef.current && leaveHandlerRef.current) {
      target.removeEventListener("mouseenter", enterHandlerRef.current);
      target.removeEventListener("mouseleave", leaveHandlerRef.current);
      target.removeEventListener("touchstart", enterHandlerRef.current);
      target.removeEventListener("touchend", leaveHandlerRef.current);
      enterHandlerRef.current = null;
      leaveHandlerRef.current = null;
    }

    const ctx = ctxRef.current;
    if (ctx) {
      coreOscRef.current?.stop();
      harmOscRef.current?.stop();
      noiseSourceRef.current?.stop();

      coreOscRef.current?.disconnect();
      coreGainRef.current?.disconnect();
      harmOscRef.current?.disconnect();
      harmGainRef.current?.disconnect();
      formant1Ref.current?.disconnect();
      formant2Ref.current?.disconnect();
      formant3Ref.current?.disconnect();
      noiseSourceRef.current?.disconnect();
      noiseFilterRef.current?.disconnect();
      noiseGainRef.current?.disconnect();
      masterEnvRef.current?.disconnect();
      dryGainRef.current?.disconnect();
      wetGainRef.current?.disconnect();
      convolverRef.current?.disconnect();
      delayRef.current?.disconnect();
      fbRef.current?.disconnect();

      ctx.close().catch(() => {});
    }

    ctxRef.current = null;
    coreOscRef.current = null;
    coreGainRef.current = null;
    harmOscRef.current = null;
    harmGainRef.current = null;
    formant1Ref.current = null;
    formant2Ref.current = null;
    formant3Ref.current = null;
    noiseSourceRef.current = null;
    noiseFilterRef.current = null;
    noiseGainRef.current = null;
    masterEnvRef.current = null;
    dryGainRef.current = null;
    wetGainRef.current = null;
    convolverRef.current = null;
    delayRef.current = null;
    fbRef.current = null;
  }, [options?.targetRef]);

  return { isActive, toggle, dispose };
}