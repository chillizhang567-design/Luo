"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  playBallConnectSound,
  playBallBounceSound,
  playMouseReactionSound,
} from "@/lib/audio/ballSounds";
import { isSoundEnabled, setSoundEnabled } from "@/lib/audio/context";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  gradient: string[];
  phase: number;
  paletteIndex: number;
  bounced: boolean;
}

const BALL_CONFIG = {
  count: 120,
  gravity: 0.08,
  friction: 0.98,
  minSize: 4,
  maxSize: 18,
  lightIntensity: 4,
  mouseRadius: 200,
  springStrength: 0.02,
  repulsionStrength: 0.08,
};

const PALETTES = [
  ["#6b7ce0", "#8b9bf0", "#4b5cc0"],
  ["#e8ad68", "#f5c887", "#c88a48"],
  ["#e06b6b", "#f08b8b", "#c04b4b"],
  ["#7ce0a8", "#9cf0c8", "#5cc088"],
  ["#b86ce0", "#d88cf0", "#984cc0"],
  ["#6ce0c4", "#8cf0d8", "#4cc0a4"],
  ["#e0c46c", "#f0d88c", "#c0a44c"],
];

export default function InteractiveHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animFrameRef = useRef<number>(0);
  const [soundOn, setSoundOn] = useState(false);
  const soundOnRef = useRef(false);

  useEffect(() => {
    soundOnRef.current = soundOn;
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const createBall = useCallback(
    (width: number, height: number): Ball => {
      const paletteIndex = Math.floor(Math.random() * PALETTES.length);
      const palette = PALETTES[paletteIndex];
      const baseRadius =
        BALL_CONFIG.minSize +
        Math.random() * (BALL_CONFIG.maxSize - BALL_CONFIG.minSize);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: baseRadius,
        baseRadius,
        color: palette[0],
        gradient: palette,
        phase: Math.random() * Math.PI * 2,
        paletteIndex,
        bounced: false,
      };
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initBalls();
    };

    const initBalls = () => {
      const balls: Ball[] = [];
      for (let i = 0; i < BALL_CONFIG.count; i++) {
        balls.push(createBall(width, height));
      }
      ballsRef.current = balls;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const balls = ballsRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];

        ball.vy += BALL_CONFIG.gravity * 0.02;
        ball.vx *= BALL_CONFIG.friction;
        ball.vy *= BALL_CONFIG.friction;

        if (mouse.active) {
          const dx = mouse.x - ball.x;
          const dy = mouse.y - ball.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < BALL_CONFIG.mouseRadius) {
            const proximity = 1 - dist / BALL_CONFIG.mouseRadius;
            const force = proximity * BALL_CONFIG.repulsionStrength;
            ball.vx -= (dx / dist) * force * 10;
            ball.vy -= (dy / dist) * force * 10;

            if (soundOnRef.current && proximity > 0.3) {
              playMouseReactionSound(proximity);
            }
          }

          const targetX = mouse.x * 0.3 + ball.x * 0.7;
          const targetY = mouse.y * 0.3 + ball.y * 0.7;
          ball.vx += (targetX - ball.x) * BALL_CONFIG.springStrength * 0.1;
          ball.vy += (targetY - ball.y) * BALL_CONFIG.springStrength * 0.1;
        }

        ball.bounced = false;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x < ball.radius) {
          ball.x = ball.radius;
          ball.vx *= -0.8;
          ball.bounced = true;
        }
        if (ball.x > width - ball.radius) {
          ball.x = width - ball.radius;
          ball.vx *= -0.8;
          ball.bounced = true;
        }
        if (ball.y < ball.radius) {
          ball.y = ball.radius;
          ball.vy *= -0.8;
          ball.bounced = true;
        }
        if (ball.y > height - ball.radius) {
          ball.y = height - ball.radius;
          ball.vy *= -0.8;
          ball.bounced = true;
        }

        if (ball.bounced && soundOnRef.current) {
          const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          playBallBounceSound(speed, ball.paletteIndex);
        }

        ball.phase += 0.02;
        const pulse = Math.sin(ball.phase) * 0.15 + 1;
        ball.radius = ball.baseRadius * pulse;

        const gradient = ctx.createRadialGradient(
          ball.x,
          ball.y,
          0,
          ball.x,
          ball.y,
          ball.radius * BALL_CONFIG.lightIntensity
        );
        gradient.addColorStop(0, ball.gradient[1] + "cc");
        gradient.addColorStop(0.4, ball.gradient[0] + "66");
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(
          ball.x,
          ball.y,
          ball.radius * BALL_CONFIG.lightIntensity,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.gradient[1] + "ee";
        ctx.fill();
      }

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = a.radius + b.radius + 30;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(232, 173, 104, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            if (soundOnRef.current && alpha > 0.08) {
              playBallConnectSound(dist, maxDist, a.paletteIndex);
            }
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";

      animFrameRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        };
      }
    };

    const onTouchEnd = () => {
      mouseRef.current.active = false;
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [createBall]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="interactive-hero-canvas"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 0,
        }}
      />
      <button
        type="button"
        onClick={toggleSound}
        className={`absolute bottom-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all hover:scale-105 active:scale-95 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 ${
          soundOn
            ? "border-amber-400/50 bg-amber-400/15 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.3)]"
            : "border-white/15 bg-white/5 text-white/50"
        }`}
        aria-label={soundOn ? "Mute ball sounds" : "Enable ball sounds"}
        aria-pressed={soundOn}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {soundOn ? (
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
    </>
  );
}