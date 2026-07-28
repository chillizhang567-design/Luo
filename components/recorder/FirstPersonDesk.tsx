"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const WIDTH = 640;
const HEIGHT = 400;

const hash = (value: number) => {
  const x = Math.sin(value * 91.37) * 43758.5453;
  return x - Math.floor(x);
};

function pixelCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2);
  context.fill();
}

/* A faint moonlit window glowing behind the desk — first-person POV. */
function drawWindow(context: CanvasRenderingContext2D, time: number) {
  // soft glow bleeding into the room
  const gx = 486;
  const gy = 64;
  const glow = context.createRadialGradient(gx, gy, 6, gx, gy, 150);
  glow.addColorStop(0, "rgba(120, 150, 190, 0.16)");
  glow.addColorStop(0.5, "rgba(70, 100, 150, 0.06)");
  glow.addColorStop(1, "rgba(70, 100, 150, 0)");
  context.fillStyle = glow;
  context.fillRect(gx - 150, gy - 150, 300, 300);

  // window frame
  const x = 430;
  const y = 18;
  const w = 150;
  const h = 104;
  context.fillStyle = "#1a232c";
  context.fillRect(x - 6, y - 6, w + 12, h + 12);
  const sky = context.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, "#0a1830");
  sky.addColorStop(1, "#1c3a5c");
  context.fillStyle = sky;
  context.fillRect(x, y, w, h);

  // moon — fixed in place; only its glow and brightness breathe.
  // (time is in ms, so all factors are tiny to keep motion slow + calm.)
  const moonX = x + 108;
  const moonY = y + 30;
  const breath = 0.5 + 0.5 * Math.sin(time * 0.0006); // slow 0 → 1
  const glowAlpha = 0.62 + breath * 0.26; // inner glow intensity
  const mg = context.createRadialGradient(moonX, moonY, 4, moonX, moonY, 30);
  mg.addColorStop(0, `rgba(255, 230, 165, ${glowAlpha.toFixed(3)})`);
  mg.addColorStop(0.4, `rgba(246, 194, 109, ${(glowAlpha * 0.35).toFixed(3)})`);
  mg.addColorStop(1, "rgba(246, 194, 109, 0)");
  context.fillStyle = mg;
  context.fillRect(moonX - 30, moonY - 30, 60, 60);
  // moon body — stable position, faint brightness breathing only.
  context.globalAlpha = 0.9 + breath * 0.1;
  pixelCircle(context, moonX, moonY, 11, "#ffe3a4");
  context.globalAlpha = 1;

  // a couple of distant stars — slow, gentle twinkle (opacity only).
  for (let i = 0; i < 10; i += 1) {
    const sx = x + hash(i * 3.3) * w;
    const sy = y + hash(i * 7.1) * (h * 0.6);
    context.globalAlpha = 0.4 + Math.sin(time * 0.0012 + i) * 0.25;
    context.fillStyle = "#cdd9e0";
    context.fillRect(Math.round(sx), Math.round(sy), 1, 1);
  }
  context.globalAlpha = 1;

  // moonlight reflection on the lower pane — fixed, only its opacity shimmers.
  const reflectAlpha = 0.12 + breath * 0.1;
  context.fillStyle = `rgba(255, 224, 150, ${reflectAlpha.toFixed(3)})`;
  for (let r = 0; r < 4; r += 1) {
    const ry = y + 60 + r * 9;
    const span = 10 + r * 4;
    context.fillRect(moonX - span, ry, span * 2, 1);
  }

  // muntins
  context.fillStyle = "#101820";
  context.fillRect(x + w / 2 - 1, y, 2, h);
  context.fillRect(x, y + h / 2 - 1, w, 2);
}

/* Warm lamp pooling from the upper left. */
function drawLamp(context: CanvasRenderingContext2D, time: number) {
  const pulse = 0.94 + Math.sin(time * 0.0011) * 0.05;
  const gx = 116;
  const gy = 96;
  const glow = context.createRadialGradient(gx, gy, 10, gx, gy, 230 * pulse);
  glow.addColorStop(0, "rgba(255, 196, 104, 0.4)");
  glow.addColorStop(0.4, "rgba(228, 132, 54, 0.13)");
  glow.addColorStop(1, "rgba(228, 132, 54, 0)");
  context.fillStyle = glow;
  context.fillRect(gx - 230, gy - 230, 460, 460);
}

/* The leather cover the diary sits on (DOM paper overlays this). */
function drawBook(context: CanvasRenderingContext2D) {
  const x = 150;
  const y = 236;
  const w = 344;
  const h = 142;
  context.save();
  context.translate(0, 0);
  context.rotate(-0.012);
  // shadow under the book
  context.fillStyle = "rgba(2, 3, 5, 0.5)";
  context.fillRect(x - 6, y + 8, w + 12, h + 8);
  // leather cover
  const cover = context.createLinearGradient(x, y, x, y + h);
  cover.addColorStop(0, "#3a241a");
  cover.addColorStop(0.5, "#2c1a13");
  cover.addColorStop(1, "#1f120d");
  context.fillStyle = cover;
  context.beginPath();
  const r = 10;
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
  context.fill();
  // spine highlight + tooled border
  context.strokeStyle = "rgba(180, 130, 80, 0.22)";
  context.lineWidth = 1;
  context.strokeRect(x + 9, y + 9, w - 18, h - 18);
  context.fillStyle = "rgba(150, 110, 70, 0.3)";
  context.fillRect(x + w / 2 - 2, y + 6, 4, h - 12);
  context.restore();
}

/* A wooden pencil resting to the right of the diary. */
function drawPencil(context: CanvasRenderingContext2D, time: number) {
  const x = 506;
  const y = 332;
  context.save();
  context.translate(x, y);
  context.rotate(-0.5);
  context.fillStyle = "#caa15c"; // body
  context.fillRect(0, -3, 58, 6);
  context.fillStyle = "#8a6a3a"; // ferrule
  context.fillRect(54, -3, 6, 6);
  context.fillStyle = "#d8d2c4"; // eraser
  context.fillRect(60, -3, 6, 6);
  context.fillStyle = "#e9c98a"; // sharpened tip
  context.beginPath();
  context.moveTo(-10, 0);
  context.lineTo(0, -3);
  context.lineTo(0, 3);
  context.closePath();
  context.fill();
  context.fillStyle = "#3a2a1c"; // lead
  context.beginPath();
  context.moveTo(-10, 0);
  context.lineTo(-5, -1);
  context.lineTo(-5, 1);
  context.closePath();
  context.fill();
  context.restore();
}

/* A tea cup with slow rising steam. */
function drawCup(context: CanvasRenderingContext2D, time: number) {
  const x = 560;
  const y = 320;
  context.fillStyle = "rgba(8, 6, 5, 0.4)";
  context.fillRect(x - 2, y + 30, 44, 8);
  context.fillStyle = "#9b6f4d";
  context.fillRect(x, y, 34, 30);
  context.fillStyle = "#cfad7a";
  context.fillRect(x + 3, y + 3, 28, 22);
  context.strokeStyle = "#b08a5c";
  context.lineWidth = 3;
  context.beginPath();
  context.arc(x + 36, y + 14, 8, -Math.PI / 2, Math.PI / 2);
  context.stroke();
  context.fillStyle = "#432d1d";
  context.fillRect(x + 3, y + 2, 28, 3);
  // steam
  context.strokeStyle = "rgba(230, 218, 191, 0.22)";
  context.lineWidth = 1;
  for (let t = 0; t < 3; t += 1) {
    const sway = Math.sin(time * 0.0011 + t * 2) * 4;
    context.beginPath();
    context.moveTo(x + 8 + t * 9, y - 2);
    context.bezierCurveTo(
      x + 4 + t * 9 + sway,
      y - 12,
      x + 12 + t * 9 - sway,
      y - 20,
      x + 8 + t * 9,
      y - 30,
    );
    context.stroke();
  }
}

/* A small tape recorder to the left of the diary. */
function drawRecorder(context: CanvasRenderingContext2D, time: number) {
  const x = 60;
  const y = 322;
  context.fillStyle = "rgba(8, 6, 5, 0.42)";
  context.fillRect(x - 4, y + 4, 96, 40);
  context.fillStyle = "#241c18";
  context.fillRect(x, y, 84, 36);
  context.fillStyle = "#3c2e25";
  context.fillRect(x + 4, y + 4, 76, 28);
  context.fillStyle = "#120f0e";
  context.fillRect(x + 7, y + 22, 70, 8);
  context.fillStyle = "#b88d55";
  context.fillRect(x + 34, y + 25, 14, 3);
  for (const reelX of [x + 22, x + 62]) {
    context.save();
    context.translate(reelX, y + 14);
    context.rotate(time * 0.0003);
    pixelCircle(context, 0, 0, 9, "#151312");
    pixelCircle(context, 0, 0, 6, "#8e7556");
    context.strokeStyle = "#2c221b";
    context.lineWidth = 2;
    for (let s = 0; s < 3; s += 1) {
      context.rotate((Math.PI * 2) / 3);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, -6);
      context.stroke();
    }
    pixelCircle(context, 0, 0, 2, "#191512");
    context.restore();
  }
  context.fillStyle = "#b75a3d";
  context.fillRect(x + 5, y + 26, 3, 3);
}

function drawCabin(context: CanvasRenderingContext2D, time: number) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.imageSmoothingEnabled = false;

  // room wall
  const wall = context.createLinearGradient(0, 0, 0, 220);
  wall.addColorStop(0, "#0c0c11");
  wall.addColorStop(0.6, "#1b1614");
  wall.addColorStop(1, "#2a1d16");
  context.fillStyle = wall;
  context.fillRect(0, 0, WIDTH, 220);

  drawWindow(context, time);
  drawLamp(context, time);
  drawBook(context);

  // desk surface
  const deskTop = 212;
  const desk = context.createLinearGradient(0, deskTop, 0, HEIGHT);
  desk.addColorStop(0, "#6c3f22");
  desk.addColorStop(0.05, "#4a2a1a");
  desk.addColorStop(1, "#1c110c");
  context.fillStyle = desk;
  context.fillRect(0, deskTop, WIDTH, HEIGHT - deskTop);
  context.fillStyle = "#8a5a34";
  context.fillRect(0, deskTop, WIDTH, 4);
  // wood grain
  context.fillStyle = "rgba(10, 7, 6, 0.28)";
  for (let y = deskTop + 16; y < HEIGHT; y += 16) {
    context.fillRect(0, y, WIDTH, 2);
  }
  for (let k = 0; k < 22; k += 1) {
    const x = hash(k * 4.7) * WIDTH;
    const y = deskTop + 10 + hash(k * 7.2) * (HEIGHT - deskTop - 14);
    context.strokeStyle = "rgba(20, 12, 10, 0.26)";
    context.strokeRect(Math.round(x), Math.round(y), 9 + (k % 7), 2);
  }

  drawRecorder(context, time);
  drawPencil(context, time);
  drawCup(context, time);

  // dust motes
  for (let m = 0; m < 22; m += 1) {
    const x =
      (hash(m * 3.7) * WIDTH + time * (0.001 + hash(m) * 0.002)) % WIDTH;
    const y =
      30 + ((hash(m * 8.1) * 200 + Math.sin(time * 0.0006 + m) * 8) % 200);
    context.globalAlpha = 0.06 + hash(m * 11.2) * 0.16;
    context.fillStyle = m % 4 === 0 ? "#f2c77c" : "#d2c4aa";
    context.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  context.globalAlpha = 1;

  // vignette
  const vig = context.createRadialGradient(320, 200, 130, 320, 200, 400);
  vig.addColorStop(0, "rgba(0, 0, 0, 0)");
  vig.addColorStop(0.72, "rgba(3, 5, 9, 0.1)");
  vig.addColorStop(1, "rgba(2, 3, 6, 0.55)");
  context.fillStyle = vig;
  context.fillRect(0, 0, WIDTH, HEIGHT);
}

export default function FirstPersonDesk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    const render = (time: number) => {
      drawCabin(context, reduceMotion ? 0 : time);
      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="firstperson-desk-canvas"
      width={WIDTH}
      height={HEIGHT}
      aria-hidden="true"
      role="img"
    />
  );
}
