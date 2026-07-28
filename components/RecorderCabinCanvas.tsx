"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const WIDTH = 640;
const HEIGHT = 360;

const hash = (value: number) => {
  const x = Math.sin(value * 91.37) * 43758.5453;
  return x - Math.floor(x);
};

function pixelCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(Math.round(x), Math.round(y), radius, 0, Math.PI * 2);
  context.fill();
}

function drawWindow(context: CanvasRenderingContext2D, time: number) {
  const x = 383;
  const y = 24;
  const width = 224;
  const height = 151;

  context.save();
  context.fillStyle = "#201813";
  context.fillRect(x - 8, y - 8, width + 16, height + 16);
  context.fillStyle = "#4a3021";
  context.fillRect(x - 4, y - 4, width + 8, height + 8);
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();

  const sky = context.createLinearGradient(0, y, 0, y + height);
  sky.addColorStop(0, "#07152e");
  sky.addColorStop(0.65, "#183b66");
  sky.addColorStop(1, "#294c6a");
  context.fillStyle = sky;
  context.fillRect(x, y, width, height);

  for (let index = 0; index < 46; index += 1) {
    const starX = x + 8 + hash(index * 8.3) * (width - 16);
    const starY = y + 7 + hash(index * 5.9) * 75;
    context.globalAlpha = 0.45 + Math.sin(time * 0.0014 + index) * 0.22;
    context.fillStyle = index % 5 === 0 ? "#f5d28b" : "#c9d7d5";
    context.fillRect(Math.round(starX), Math.round(starY), index % 9 === 0 ? 2 : 1, 1);
  }
  context.globalAlpha = 1;

  const moonX = 542;
  const moonY = 57;
  const glow = context.createRadialGradient(moonX, moonY, 6, moonX, moonY, 35);
  glow.addColorStop(0, "rgba(255, 225, 158, .7)");
  glow.addColorStop(0.4, "rgba(246, 194, 109, .24)");
  glow.addColorStop(1, "rgba(246, 194, 109, 0)");
  context.fillStyle = glow;
  context.fillRect(moonX - 40, moonY - 40, 80, 80);
  pixelCircle(context, moonX, moonY, 18, "#ffe0a0");
  pixelCircle(context, moonX - 6, moonY - 3, 4, "#e7bd79");
  pixelCircle(context, moonX + 6, moonY + 5, 3, "#edc782");
  pixelCircle(context, moonX + 3, moonY - 8, 2, "#f1cb85");

  context.fillStyle = "#142d49";
  context.beginPath();
  context.moveTo(x, 109);
  context.lineTo(x + 42, 91);
  context.lineTo(x + 81, 108);
  context.lineTo(x + 120, 97);
  context.lineTo(x + 160, 109);
  context.lineTo(x + width, 99);
  context.lineTo(x + width, 122);
  context.lineTo(x, 122);
  context.fill();

  const ocean = context.createLinearGradient(0, y + 105, 0, y + height);
  ocean.addColorStop(0, "#102d4d");
  ocean.addColorStop(1, "#071c35");
  context.fillStyle = ocean;
  context.fillRect(x, y + 105, width, height - 105);

  const lighthouseX = 409;
  context.fillStyle = "#b5b2a1";
  context.fillRect(lighthouseX, 84, 5, 27);
  context.fillStyle = "#182030";
  context.fillRect(lighthouseX - 1, 82, 7, 4);
  context.fillStyle = "#ffd47f";
  context.fillRect(lighthouseX + 1, 83, 3, 3);
  const beacon = context.createLinearGradient(lighthouseX, 0, lighthouseX + 58, 0);
  beacon.addColorStop(0, "rgba(255, 215, 130, .32)");
  beacon.addColorStop(1, "rgba(255, 215, 130, 0)");
  context.fillStyle = beacon;
  context.beginPath();
  context.moveTo(lighthouseX + 4, 84);
  context.lineTo(lighthouseX + 62, 78);
  context.lineTo(lighthouseX + 62, 91);
  context.closePath();
  context.fill();

  for (let row = 0; row < 8; row += 1) {
    const waveY = 131 + row * 5;
    const drift = (time * (0.002 + row * 0.0003)) % 14;
    context.strokeStyle =
      row % 3 === 0 ? "rgba(116, 164, 190, .42)" : "rgba(31, 82, 121, .65)";
    context.lineWidth = 1;
    context.beginPath();
    for (let waveX = x - 14; waveX < x + width + 20; waveX += 14) {
      context.moveTo(Math.round(waveX + drift), waveY);
      context.lineTo(Math.round(waveX + 7 + drift), waveY - 1);
      context.lineTo(Math.round(waveX + 12 + drift), waveY);
    }
    context.stroke();
  }

  for (let row = 0; row < 7; row += 1) {
    const shimmerY = 117 + row * 7;
    const span = 5 + row * 3;
    context.globalAlpha = 0.32 + Math.sin(time * 0.002 + row) * 0.1;
    context.fillStyle = "#f4c978";
    context.fillRect(moonX - span, shimmerY, span * 2, 1);
  }
  context.globalAlpha = 1;
  context.restore();

  context.fillStyle = "#2a1c16";
  context.fillRect(x + 107, y, 6, height);
  context.fillRect(x, y + 81, width, 6);
  context.fillStyle = "#6c4930";
  context.fillRect(x + 109, y, 2, height);
  context.fillRect(x, y + 82, width, 2);
  context.fillStyle = "#130f0d";
  context.fillRect(x - 8, y + height + 8, width + 16, 6);
}

function drawLamp(context: CanvasRenderingContext2D, time: number) {
  const pulse = 0.92 + Math.sin(time * 0.0015) * 0.06;
  const glow = context.createRadialGradient(105, 238, 4, 105, 238, 80 * pulse);
  glow.addColorStop(0, "rgba(255, 194, 91, .48)");
  glow.addColorStop(0.42, "rgba(230, 127, 48, .16)");
  glow.addColorStop(1, "rgba(230, 127, 48, 0)");
  context.fillStyle = glow;
  context.fillRect(24, 157, 162, 150);

  context.fillStyle = "#211610";
  context.fillRect(102, 205, 6, 37);
  context.fillRect(91, 242, 28, 5);
  context.fillRect(96, 201, 18, 4);
  context.fillStyle = "#5d3923";
  context.fillRect(103, 205, 3, 37);
  context.fillStyle = "#d28a43";
  context.beginPath();
  context.moveTo(84, 202);
  context.lineTo(126, 202);
  context.lineTo(117, 177);
  context.lineTo(93, 177);
  context.closePath();
  context.fill();
  context.fillStyle = "#f5c46f";
  context.beginPath();
  context.moveTo(90, 199);
  context.lineTo(120, 199);
  context.lineTo(114, 181);
  context.lineTo(96, 181);
  context.closePath();
  context.fill();
}

function drawNotebook(context: CanvasRenderingContext2D) {
  context.save();
  context.translate(291, 280);
  context.rotate(-0.035);
  context.fillStyle = "rgba(16, 10, 8, .45)";
  context.fillRect(-70, -19, 145, 51);
  context.fillStyle = "#d7bc85";
  context.beginPath();
  context.moveTo(-70, -24);
  context.lineTo(-3, -20);
  context.lineTo(-4, 25);
  context.lineTo(-72, 19);
  context.closePath();
  context.fill();
  context.fillStyle = "#ead6a4";
  context.beginPath();
  context.moveTo(0, -20);
  context.lineTo(70, -25);
  context.lineTo(72, 18);
  context.lineTo(1, 25);
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(89, 65, 46, .32)";
  context.lineWidth = 1;
  for (let line = -12; line <= 13; line += 7) {
    context.beginPath();
    context.moveTo(-63, line);
    context.lineTo(-10, line + 3);
    context.moveTo(10, line + 3);
    context.lineTo(63, line);
    context.stroke();
  }
  context.fillStyle = "#6f3726";
  context.fillRect(-3, -20, 3, 45);
  context.restore();
}

function drawRecorder(context: CanvasRenderingContext2D, time: number) {
  const x = 412;
  const y = 253;
  context.fillStyle = "rgba(11, 7, 6, .42)";
  context.fillRect(x - 6, y + 5, 104, 48);
  context.fillStyle = "#2a211d";
  context.fillRect(x, y, 91, 43);
  context.fillStyle = "#49382d";
  context.fillRect(x + 4, y + 4, 83, 34);
  context.fillStyle = "#171514";
  context.fillRect(x + 7, y + 25, 77, 10);
  context.fillStyle = "#b88d55";
  context.fillRect(x + 38, y + 28, 15, 3);

  for (const reelX of [x + 24, x + 67]) {
    context.save();
    context.translate(reelX, y + 15);
    context.rotate(time * 0.00025);
    pixelCircle(context, 0, 0, 10, "#171515");
    pixelCircle(context, 0, 0, 7, "#9a8060");
    context.strokeStyle = "#302820";
    context.lineWidth = 2;
    for (let spoke = 0; spoke < 3; spoke += 1) {
      context.rotate((Math.PI * 2) / 3);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, -7);
      context.stroke();
    }
    pixelCircle(context, 0, 0, 2, "#1b1714");
    context.restore();
  }
  context.fillStyle = "#b75a3d";
  context.fillRect(x + 8, y + 29, 3, 3);
}

function drawCup(context: CanvasRenderingContext2D, time: number) {
  context.fillStyle = "rgba(12, 8, 6, .35)";
  context.fillRect(548, 286, 45, 8);
  context.fillStyle = "#9b6f4d";
  context.fillRect(550, 260, 30, 25);
  context.fillStyle = "#cfad7a";
  context.fillRect(553, 262, 24, 19);
  context.strokeStyle = "#af855b";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(580, 271, 9, -Math.PI / 2, Math.PI / 2);
  context.stroke();
  context.fillStyle = "#47301f";
  context.fillRect(554, 260, 22, 3);

  context.strokeStyle = "rgba(230, 218, 191, .28)";
  context.lineWidth = 1;
  for (let trail = 0; trail < 2; trail += 1) {
    const sway = Math.sin(time * 0.0011 + trail * 2) * 3;
    context.beginPath();
    context.moveTo(561 + trail * 8, 258);
    context.bezierCurveTo(
      557 + trail * 8 + sway,
      250,
      568 + trail * 7 - sway,
      244,
      561 + trail * 8,
      236,
    );
    context.stroke();
  }
}

function drawCabin(context: CanvasRenderingContext2D, time: number) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.imageSmoothingEnabled = false;

  const wall = context.createLinearGradient(0, 0, 0, 260);
  wall.addColorStop(0, "#171718");
  wall.addColorStop(0.58, "#35231c");
  wall.addColorStop(1, "#513321");
  context.fillStyle = wall;
  context.fillRect(0, 0, WIDTH, 260);

  for (let y = 12; y < 255; y += 21) {
    context.fillStyle = y % 42 === 12 ? "rgba(104, 66, 39, .18)" : "rgba(8, 7, 9, .14)";
    context.fillRect(0, y, WIDTH, 2);
  }
  for (let x = 18; x < WIDTH; x += 61) {
    const offset = Math.floor(hash(x) * 40);
    context.fillStyle = "rgba(13, 10, 10, .16)";
    context.fillRect(x + offset, 12, 1, 230);
  }

  drawWindow(context, time);
  context.fillStyle = "#1e1512";
  context.fillRect(0, 224, WIDTH, 12);
  const desk = context.createLinearGradient(0, 235, 0, HEIGHT);
  desk.addColorStop(0, "#704526");
  desk.addColorStop(0.06, "#4f2d1d");
  desk.addColorStop(1, "#211614");
  context.fillStyle = desk;
  context.fillRect(0, 235, WIDTH, HEIGHT - 235);
  context.fillStyle = "#93623a";
  context.fillRect(0, 235, WIDTH, 4);
  context.fillStyle = "rgba(12, 8, 8, .3)";
  for (let y = 251; y < HEIGHT; y += 18) context.fillRect(0, y, WIDTH, 2);
  for (let knot = 0; knot < 18; knot += 1) {
    const x = hash(knot * 4.7) * WIDTH;
    const y = 245 + hash(knot * 7.2) * 105;
    context.strokeStyle = "rgba(23, 13, 11, .28)";
    context.strokeRect(Math.round(x), Math.round(y), 8 + (knot % 7), 2);
  }

  drawLamp(context, time);
  drawNotebook(context);
  drawRecorder(context, time);
  drawCup(context, time);

  for (let mote = 0; mote < 24; mote += 1) {
    const x = (hash(mote * 3.7) * WIDTH + time * (0.001 + hash(mote) * 0.002)) % WIDTH;
    const y = 25 + ((hash(mote * 8.1) * 220 + Math.sin(time * 0.0006 + mote) * 8) % 220);
    context.globalAlpha = 0.08 + hash(mote * 11.2) * 0.18;
    context.fillStyle = mote % 4 === 0 ? "#f2c77c" : "#d2c4aa";
    context.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  context.globalAlpha = 1;

  const vignette = context.createRadialGradient(320, 180, 120, 320, 180, 390);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.72, "rgba(3, 6, 10, .08)");
  vignette.addColorStop(1, "rgba(2, 4, 8, .56)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, WIDTH, HEIGHT);
}

export default function RecorderCabinCanvas() {
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
      className="recorder-cabin-canvas"
      width={WIDTH}
      height={HEIGHT}
      aria-label="A warm cabin at night. A notebook, vintage recorder, lamp, and tea rest on a wooden desk while the moonlit ocean and lighthouse glow through the window."
      role="img"
    />
  );
}
