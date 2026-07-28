"use client";

import { useEffect, useRef } from "react";
import type { SceneConfig } from "@/sceneConfig";

type PixelCanvasSceneProps = {
  config: SceneConfig;
};

type Point = [number, number];

const WIDTH = 640;
const HEIGHT = 360;

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const stars = Array.from({ length: 118 }, (_, index) => ({
  x: 7 + seededRandom(index + 1) * 626,
  y: 5 + seededRandom(index + 91) * 168,
  size: index % 29 === 0 ? 2 : 1,
  phase: seededRandom(index + 177) * Math.PI * 2,
  brightness: 0.28 + seededRandom(index + 221) * 0.68,
}));

const grass = Array.from({ length: 96 }, (_, index) => ({
  x: seededRandom(index + 301) * WIDTH,
  y: 296 + seededRandom(index + 401) * 63,
  height: 3 + seededRandom(index + 501) * 11,
  phase: seededRandom(index + 601) * Math.PI * 2,
  shade: index % 3,
}));

const flowers = Array.from({ length: 52 }, (_, index) => {
  const side = index % 2 === 0;
  const x = side
    ? seededRandom(index + 701) * 174
    : 455 + seededRandom(index + 801) * 178;
  return {
    x,
    y: 301 + seededRandom(index + 901) * 52,
    color: ["#eee0bb", "#d08c78", "#8372a8", "#d9a955"][index % 4],
    size: index % 7 === 0 ? 3 : 2,
    phase: seededRandom(index + 1001) * Math.PI * 2,
  };
});

const fireflies = Array.from({ length: 12 }, (_, index) => ({
  x: 26 + seededRandom(index + 1201) * 588,
  y: 276 + seededRandom(index + 1301) * 71,
  phase: seededRandom(index + 1401) * Math.PI * 2,
}));

function polygon(
  context: CanvasRenderingContext2D,
  points: Point[],
  fill: string | CanvasGradient,
) {
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index][0], points[index][1]);
  }
  context.closePath();
  context.fillStyle = fill;
  context.fill();
}

function drawCloud(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  color: string,
) {
  context.fillStyle = color;
  const blocks = [
    [0, 8, 18, 5],
    [11, 4, 20, 8],
    [25, 0, 18, 12],
    [39, 6, 24, 7],
    [57, 10, 12, 4],
  ];
  blocks.forEach(([bx, by, width, height]) => {
    context.fillRect(
      Math.round(x + bx * scale),
      Math.round(y + by * scale),
      Math.ceil(width * scale),
      Math.ceil(height * scale),
    );
  });
  context.fillStyle = "rgba(172, 157, 178, 0.18)";
  context.fillRect(
    Math.round(x + 24 * scale),
    Math.round(y + 2 * scale),
    Math.ceil(16 * scale),
    Math.max(1, Math.ceil(2 * scale)),
  );
}

function drawTree(
  context: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  height: number,
) {
  context.fillStyle = "#101b1d";
  context.fillRect(x - 1, baseY - height * 0.45, 3, height * 0.45);
  polygon(
    context,
    [
      [x, baseY - height],
      [x - height * 0.22, baseY - height * 0.35],
      [x + height * 0.22, baseY - height * 0.35],
    ],
    "#102a2b",
  );
  polygon(
    context,
    [
      [x, baseY - height * 0.76],
      [x - height * 0.29, baseY - height * 0.14],
      [x + height * 0.29, baseY - height * 0.14],
    ],
    "#0b2326",
  );
  context.fillStyle = "#29413a";
  context.fillRect(x - 2, baseY - height * 0.73, 2, height * 0.35);
}

function drawLighthouse(context: CanvasRenderingContext2D, time: number) {
  polygon(
    context,
    [
      [0, 193],
      [0, 135],
      [24, 150],
      [51, 162],
      [83, 170],
      [121, 184],
      [169, 194],
    ],
    "#10253a",
  );
  polygon(
    context,
    [
      [0, 181],
      [22, 176],
      [42, 183],
      [68, 175],
      [96, 186],
      [125, 181],
      [169, 194],
      [0, 198],
    ],
    "#173247",
  );

  for (let index = 0; index < 18; index += 1) {
    const x = seededRandom(index + 1501) * 158;
    const y = 177 + seededRandom(index + 1601) * 17;
    context.fillStyle = index % 3 === 0 ? "#2b4653" : "#0b1d2f";
    context.fillRect(Math.round(x), Math.round(y), 3 + (index % 4), 2);
  }

  drawTree(context, 9, 177, 43);
  drawTree(context, 29, 180, 31);
  drawTree(context, 54, 182, 37);
  drawTree(context, 101, 186, 28);

  context.fillStyle = "#1b2731";
  context.fillRect(54, 166, 30, 17);
  polygon(context, [[50, 166], [69, 153], [89, 166]], "#0b141f");
  context.fillStyle = "#efb55d";
  context.fillRect(72, 172, 4, 5);
  context.fillStyle = "rgba(240, 175, 84, 0.15)";
  context.fillRect(67, 167, 14, 13);

  polygon(
    context,
    [[108, 174], [112, 129], [124, 129], [128, 174]],
    "#52616c",
  );
  context.fillStyle = "#263947";
  context.fillRect(109, 150, 5, 4);
  context.fillRect(111, 163, 4, 4);
  context.fillStyle = "#111a21";
  context.fillRect(106, 125, 23, 4);
  polygon(context, [[107, 124], [118, 116], [128, 124]], "#0a121a");

  const glow = 0.72 + Math.sin(time * 1.4) * 0.18;
  const lighthouseGlow = context.createRadialGradient(118, 124, 1, 118, 124, 20);
  lighthouseGlow.addColorStop(0, `rgba(255, 211, 125, ${glow})`);
  lighthouseGlow.addColorStop(0.25, "rgba(242, 176, 79, 0.36)");
  lighthouseGlow.addColorStop(1, "rgba(242, 176, 79, 0)");
  context.fillStyle = lighthouseGlow;
  context.fillRect(98, 104, 40, 40);
  context.fillStyle = "#ffd884";
  context.fillRect(113, 120, 10, 8);
}

function drawMoon(context: CanvasRenderingContext2D, time: number) {
  const x = 500;
  const y = 62;
  const radius = 31;
  const pulse = 0.95 + Math.sin(time * 0.55) * 0.04;
  const glow = context.createRadialGradient(x, y, 20, x, y, 55);
  glow.addColorStop(0, `rgba(255, 226, 157, ${0.28 * pulse})`);
  glow.addColorStop(0.48, "rgba(247, 186, 91, 0.11)");
  glow.addColorStop(1, "rgba(244, 177, 80, 0)");
  context.fillStyle = glow;
  context.fillRect(x - 56, y - 56, 112, 112);

  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = "#ffe3a0";
  context.fill();
  context.strokeStyle = "#fff1bd";
  context.lineWidth = 2;
  context.stroke();

  const craters = [
    [489, 50, 7, 4],
    [511, 67, 10, 7],
    [491, 76, 5, 4],
    [516, 47, 4, 3],
    [477, 64, 4, 5],
  ];
  context.fillStyle = "rgba(210, 151, 72, 0.43)";
  craters.forEach(([cx, cy, rx, ry]) => {
    context.beginPath();
    context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    context.fill();
  });
}

function drawOcean(context: CanvasRenderingContext2D, time: number) {
  const ocean = context.createLinearGradient(0, 180, 0, 286);
  ocean.addColorStop(0, "#16466d");
  ocean.addColorStop(0.48, "#0b3459");
  ocean.addColorStop(1, "#071f3b");
  context.fillStyle = ocean;
  context.fillRect(0, 181, WIDTH, 111);

  context.fillStyle = "rgba(161, 190, 198, 0.22)";
  context.fillRect(0, 181, WIDTH, 1);

  for (let layer = 0; layer < 8; layer += 1) {
    const baseY = 188 + layer * 11.3;
    const amplitude = 0.8 + layer * 0.43;
    const wavelength = 33 + layer * 8;
    const speed = 0.13 + layer * 0.022;
    const points: Point[] = [];

    for (let x = -8; x <= WIDTH + 8; x += 3) {
      const wave =
        Math.sin(x / wavelength + time * speed + layer * 0.7) * amplitude +
        Math.sin(x / (wavelength * 0.43) - time * speed * 0.7 + layer) *
          amplitude *
          0.34;
      points.push([x, baseY + wave]);
    }

    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => context.lineTo(x, y));
    context.strokeStyle =
      layer > 5
        ? "rgba(170, 202, 204, 0.52)"
        : "rgba(100, 158, 181, 0.34)";
    context.lineWidth = layer > 5 ? 1.7 : 1;
    context.stroke();

    if (layer > 3) {
      context.beginPath();
      context.moveTo(points[0][0], points[0][1] + 2);
      points.slice(1).forEach(([x, y]) => context.lineTo(x, y + 2));
      context.strokeStyle = "rgba(3, 25, 47, 0.52)";
      context.lineWidth = 2;
      context.stroke();
    }
  }

  for (let index = 0; index < 88; index += 1) {
    const depth = seededRandom(index + 1701);
    const y = 186 + depth * 94;
    const perspective = 0.4 + depth * 1.35;
    const x =
      (seededRandom(index + 1801) * WIDTH + time * (index % 2 ? 1.7 : -1.1)) %
      WIDTH;
    const width = (2 + seededRandom(index + 1901) * 12) * perspective;
    context.fillStyle =
      index % 5 === 0
        ? "rgba(126, 174, 190, 0.34)"
        : "rgba(44, 101, 135, 0.28)";
    context.fillRect(Math.round(x), Math.round(y), Math.round(width), 1);
  }

  for (let y = 184; y < 279; y += 4) {
    const depth = (y - 181) / 98;
    const halfWidth = 5 + depth * 61;
    const center = 500 + Math.sin(time * 0.7 + y * 0.19) * (2 + depth * 5);
    const rows = 2 + Math.floor(depth * 3);
    for (let segment = 0; segment < rows; segment += 1) {
      const seed = y * 13 + segment * 17;
      const segmentX =
        center - halfWidth + seededRandom(seed) * halfWidth * 1.72;
      const segmentWidth =
        2 + seededRandom(seed + 3) * (7 + depth * 17);
      const shimmer = 0.3 + Math.sin(time * 1.8 + seed) * 0.14;
      context.fillStyle = `rgba(255, 220, 143, ${shimmer})`;
      context.fillRect(
        Math.round(segmentX),
        y,
        Math.max(2, Math.round(segmentWidth)),
        depth > 0.7 ? 2 : 1,
      );
    }
  }
}

function drawBeach(context: CanvasRenderingContext2D, time: number) {
  const shoreline: Point[] = [];
  for (let x = -8; x <= WIDTH + 8; x += 4) {
    const y =
      278 +
      Math.sin(x / 44 + time * 0.16) * 2.2 +
      Math.sin(x / 17 - time * 0.1) * 0.8;
    shoreline.push([x, y]);
  }

  context.beginPath();
  context.moveTo(shoreline[0][0], shoreline[0][1]);
  shoreline.slice(1).forEach(([x, y]) => context.lineTo(x, y));
  context.lineTo(WIDTH, 307);
  context.lineTo(0, 307);
  context.closePath();
  const sand = context.createLinearGradient(0, 276, 0, 307);
  sand.addColorStop(0, "#768078");
  sand.addColorStop(0.38, "#5a625c");
  sand.addColorStop(1, "#37423e");
  context.fillStyle = sand;
  context.fill();

  context.beginPath();
  context.moveTo(shoreline[0][0], shoreline[0][1] - 1);
  shoreline.slice(1).forEach(([x, y]) => context.lineTo(x, y - 1));
  context.strokeStyle = "rgba(216, 222, 205, 0.74)";
  context.lineWidth = 2;
  context.stroke();

  for (let index = 0; index < 50; index += 1) {
    const x = seededRandom(index + 2001) * WIDTH;
    const y = 284 + seededRandom(index + 2101) * 18;
    context.fillStyle =
      index % 3 === 0 ? "rgba(174, 155, 126, 0.38)" : "rgba(25, 43, 43, 0.4)";
    context.fillRect(Math.round(x), Math.round(y), 1 + (index % 3), 1);
  }
}

function drawMeadow(context: CanvasRenderingContext2D) {
  polygon(
    context,
    [
      [0, 296],
      [38, 291],
      [81, 297],
      [124, 289],
      [168, 295],
      [215, 288],
      [270, 296],
      [324, 290],
      [377, 297],
      [432, 289],
      [484, 296],
      [538, 288],
      [589, 295],
      [640, 290],
      [640, 360],
      [0, 360],
    ],
    "#102c25",
  );

  const meadow = context.createLinearGradient(0, 292, 0, HEIGHT);
  meadow.addColorStop(0, "rgba(40, 78, 55, 0.55)");
  meadow.addColorStop(1, "rgba(5, 20, 17, 0.7)");
  context.fillStyle = meadow;
  context.fillRect(0, 300, WIDTH, 60);
}

function drawGrassAndFlowers(context: CanvasRenderingContext2D, time: number) {
  grass.forEach((blade) => {
    const sway = Math.sin(time * 0.9 + blade.phase) * 1.7;
    const colors = ["#31583c", "#244b37", "#3a6243"];
    context.strokeStyle = colors[blade.shade];
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(Math.round(blade.x), Math.round(blade.y));
    context.lineTo(
      Math.round(blade.x + sway),
      Math.round(blade.y - blade.height),
    );
    context.stroke();
  });

  flowers.forEach((flower) => {
    const sway = Math.sin(time * 0.8 + flower.phase) * 1.1;
    const x = Math.round(flower.x + sway);
    const y = Math.round(flower.y);
    context.fillStyle = "#31543a";
    context.fillRect(x, y - 7, 1, 8);
    context.fillStyle = flower.color;
    const size = flower.size;
    context.fillRect(x - size, y - 10, size, size);
    context.fillRect(x + 1, y - 10, size, size);
    context.fillRect(x, y - 12, size, size);
    context.fillRect(x, y - 8, size, size);
    context.fillStyle = "#e0ad4c";
    context.fillRect(x, y - 10, 1, 1);
  });
}

function drawLantern(context: CanvasRenderingContext2D, time: number) {
  const x = 171;
  const y = 326;
  const pulse = 0.84 + Math.sin(time * 1.25) * 0.12;
  const glow = context.createRadialGradient(x, y - 9, 2, x, y - 9, 34);
  glow.addColorStop(0, `rgba(255, 185, 75, ${0.48 * pulse})`);
  glow.addColorStop(0.44, `rgba(229, 133, 43, ${0.17 * pulse})`);
  glow.addColorStop(1, "rgba(229, 133, 43, 0)");
  context.fillStyle = glow;
  context.fillRect(x - 36, y - 44, 72, 72);

  context.strokeStyle = "#171713";
  context.lineWidth = 2;
  context.strokeRect(x - 9, y - 22, 18, 21);
  context.fillStyle = "#131817";
  context.fillRect(x - 11, y - 25, 22, 4);
  context.fillRect(x - 11, y - 2, 22, 4);
  context.strokeStyle = "#20201b";
  context.beginPath();
  context.arc(x, y - 25, 7, Math.PI, 0);
  context.stroke();
  context.fillStyle = "#f2b353";
  context.fillRect(x - 6, y - 19, 12, 15);
  context.fillStyle = "#ffd47c";
  context.fillRect(x - 3, y - 17, 6, 11);
}

function drawCharacter(context: CanvasRenderingContext2D, time: number) {
  const breath = Math.sin(time * 0.92) * 0.6;
  const x = 233;
  const base = 346;

  context.fillStyle = "rgba(1, 8, 10, 0.54)";
  context.beginPath();
  context.ellipse(x, base - 2, 47, 8, 0, 0, Math.PI * 2);
  context.fill();

  const rim = context.createRadialGradient(x - 18, base - 35, 2, x, base - 39, 70);
  rim.addColorStop(0, "rgba(230, 151, 57, 0.11)");
  rim.addColorStop(1, "rgba(230, 151, 57, 0)");
  context.fillStyle = rim;
  context.fillRect(x - 70, base - 110, 140, 120);

  polygon(
    context,
    [
      [x - 34, base - 28],
      [x - 50, base - 18],
      [x - 48, base - 7],
      [x - 8, base - 10],
      [x + 2, base - 23],
    ],
    "#0b1b28",
  );
  polygon(
    context,
    [
      [x + 34, base - 28],
      [x + 50, base - 18],
      [x + 48, base - 7],
      [x + 8, base - 10],
      [x - 2, base - 23],
    ],
    "#091824",
  );

  polygon(
    context,
    [
      [x - 16, base - 47],
      [x - 43, base - 38],
      [x - 49, base - 22],
      [x - 25, base - 18],
      [x, base - 35],
    ],
    "#132b3a",
  );
  polygon(
    context,
    [
      [x + 16, base - 47],
      [x + 43, base - 38],
      [x + 49, base - 22],
      [x + 25, base - 18],
      [x, base - 35],
    ],
    "#0d2231",
  );

  context.fillStyle = "#193448";
  context.fillRect(x - 10, base - 53, 20, 18);

  polygon(
    context,
    [
      [x - 24, base - 93 + breath],
      [x + 24, base - 93 + breath],
      [x + 32, base - 42],
      [x + 18, base - 32],
      [x - 18, base - 32],
      [x - 32, base - 42],
    ],
    "#132d42",
  );
  context.fillStyle = "#203e53";
  context.fillRect(x - 22, base - 84 + breath, 4, 39);
  context.fillStyle = "#0b2031";
  context.fillRect(x + 22, base - 84 + breath, 4, 39);
  context.fillStyle = "rgba(83, 118, 136, 0.26)";
  context.fillRect(x, base - 80 + breath, 1, 39);

  polygon(
    context,
    [
      [x - 24, base - 86 + breath],
      [x - 37, base - 73 + breath],
      [x - 42, base - 42],
      [x - 34, base - 38],
      [x - 20, base - 66 + breath],
    ],
    "#10283a",
  );
  polygon(
    context,
    [
      [x + 24, base - 86 + breath],
      [x + 37, base - 73 + breath],
      [x + 42, base - 42],
      [x + 34, base - 38],
      [x + 20, base - 66 + breath],
    ],
    "#0b2132",
  );
  context.fillStyle = "#835d46";
  context.fillRect(x - 43, base - 43, 7, 6);
  context.fillRect(x + 36, base - 43, 7, 6);

  context.fillStyle = "#644635";
  context.fillRect(x - 7, base - 104 + breath, 14, 14);
  context.fillStyle = "#111a20";
  context.beginPath();
  context.arc(x, base - 116 + breath, 17, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#26343a";
  context.fillRect(x - 10, base - 128 + breath, 5, 4);
  context.fillRect(x - 2, base - 131 + breath, 6, 4);
  context.fillRect(x + 7, base - 127 + breath, 5, 4);
  context.fillStyle = "#865f47";
  context.fillRect(x + 15, base - 116 + breath, 4, 8);
}

function drawCat(context: CanvasRenderingContext2D, time: number) {
  const x = 73;
  const y = 339;
  const breath = Math.sin(time * 1.1) * 0.6;
  context.fillStyle = "rgba(1, 7, 7, 0.4)";
  context.fillRect(x - 22, y + 2, 48, 3);
  context.fillStyle = "#5e412d";
  context.beginPath();
  context.ellipse(x, y - 5 - breath, 19, 10 + breath, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#795139";
  context.beginPath();
  context.arc(x + 17, y - 7 - breath, 8, 0, Math.PI * 2);
  context.fill();
  polygon(context, [[x + 12, y - 13], [x + 15, y - 20], [x + 18, y - 13]], "#795139");
  polygon(context, [[x + 20, y - 13], [x + 24, y - 19], [x + 26, y - 11]], "#795139");
  context.strokeStyle = "#473225";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(x - 16, y - 2, 13, 0.6, Math.PI * 1.6);
  context.stroke();
}

function drawRabbit(context: CanvasRenderingContext2D, time: number) {
  const x = 476;
  const y = 342 + Math.sin(time * 0.7) * 0.5;
  context.fillStyle = "rgba(1, 7, 7, 0.38)";
  context.fillRect(x - 10, y + 1, 25, 3);
  context.fillStyle = "#9c9079";
  context.beginPath();
  context.ellipse(x, y - 10, 12, 14, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(x - 3, y - 25, 9, 0, Math.PI * 2);
  context.fill();
  context.fillRect(x - 10, y - 46, 5, 18);
  context.fillRect(x, y - 44, 5, 17);
  context.fillStyle = "#d3c5a8";
  context.fillRect(x + 9, y - 15, 7, 7);
  context.fillStyle = "#121313";
  context.fillRect(x - 7, y - 27, 2, 2);
}

function drawAtmosphere(context: CanvasRenderingContext2D, time: number) {
  fireflies.forEach((firefly) => {
    const alpha = Math.max(0, Math.sin(time * 0.8 + firefly.phase)) * 0.75;
    if (alpha < 0.08) return;
    const x = firefly.x + Math.sin(time * 0.45 + firefly.phase) * 3;
    const y = firefly.y + Math.cos(time * 0.37 + firefly.phase) * 3;
    const glow = context.createRadialGradient(x, y, 0, x, y, 5);
    glow.addColorStop(0, `rgba(222, 235, 92, ${alpha})`);
    glow.addColorStop(1, "rgba(222, 235, 92, 0)");
    context.fillStyle = glow;
    context.fillRect(x - 5, y - 5, 10, 10);
    context.fillStyle = `rgba(225, 239, 105, ${alpha})`;
    context.fillRect(Math.round(x), Math.round(y), 1, 1);
  });

  const mist = context.createLinearGradient(0, 150, 0, 240);
  mist.addColorStop(0, "rgba(144, 166, 190, 0)");
  mist.addColorStop(0.52, "rgba(130, 158, 181, 0.08)");
  mist.addColorStop(1, "rgba(130, 158, 181, 0)");
  context.fillStyle = mist;
  context.fillRect(0, 145, WIDTH, 100);

  const vignette = context.createRadialGradient(
    WIDTH / 2,
    HEIGHT / 2,
    120,
    WIDTH / 2,
    HEIGHT / 2,
    390,
  );
  vignette.addColorStop(0, "rgba(1, 6, 13, 0)");
  vignette.addColorStop(0.72, "rgba(1, 6, 13, 0.08)");
  vignette.addColorStop(1, "rgba(1, 6, 13, 0.55)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, WIDTH, HEIGHT);
}

function renderReferenceScene(
  context: CanvasRenderingContext2D,
  time: number,
  background: HTMLImageElement,
) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.drawImage(background, 0, 0, WIDTH, HEIGHT);

  const moonPulse = 0.92 + Math.sin(time * 0.55) * 0.08;
  const moonGlow = context.createRadialGradient(500, 58, 18, 500, 58, 53);
  moonGlow.addColorStop(0, `rgba(255, 228, 166, ${0.1 * moonPulse})`);
  moonGlow.addColorStop(0.48, `rgba(247, 184, 94, ${0.07 * moonPulse})`);
  moonGlow.addColorStop(1, "rgba(247, 184, 94, 0)");
  context.fillStyle = moonGlow;
  context.fillRect(445, 3, 110, 110);

  for (let y = 191; y < 292; y += 4) {
    const depth = (y - 188) / 106;
    const halfWidth = 8 + depth * 66;
    const center = 500 + Math.sin(time * 0.75 + y * 0.17) * (2 + depth * 4);
    const segmentCount = 1 + Math.floor(depth * 4);
    for (let segment = 0; segment < segmentCount; segment += 1) {
      const seed = y * 19 + segment * 31;
      const x =
        center - halfWidth + seededRandom(seed) * halfWidth * 1.75;
      const width = 2 + seededRandom(seed + 9) * (7 + depth * 18);
      const alpha = 0.09 + Math.max(0, Math.sin(time * 1.7 + seed)) * 0.14;
      context.fillStyle = `rgba(255, 226, 157, ${alpha})`;
      context.fillRect(
        Math.round(x),
        Math.round(y),
        Math.max(2, Math.round(width)),
        depth > 0.72 ? 2 : 1,
      );
    }
  }

  const lanternPulse = 0.82 + Math.sin(time * 1.15) * 0.16;
  const lanternGlow = context.createRadialGradient(143, 304, 2, 143, 304, 36);
  lanternGlow.addColorStop(
    0,
    `rgba(255, 182, 73, ${0.2 * lanternPulse})`,
  );
  lanternGlow.addColorStop(
    0.44,
    `rgba(229, 132, 42, ${0.08 * lanternPulse})`,
  );
  lanternGlow.addColorStop(1, "rgba(229, 132, 42, 0)");
  context.fillStyle = lanternGlow;
  context.fillRect(106, 267, 74, 74);

  stars
    .filter((_, index) => index % 8 === 0)
    .forEach((star) => {
      const alpha =
        Math.max(0, Math.sin(time * 0.66 + star.phase)) * 0.42;
      context.fillStyle = `rgba(255, 233, 178, ${alpha})`;
      context.fillRect(Math.round(star.x), Math.round(star.y), 1, 1);
    });

  fireflies.forEach((firefly, index) => {
    if (index % 2 !== 0) return;
    const alpha = Math.max(0, Math.sin(time * 0.82 + firefly.phase)) * 0.42;
    const x = firefly.x + Math.sin(time * 0.4 + firefly.phase) * 2;
    const y = Math.max(264, firefly.y) + Math.cos(time * 0.35 + firefly.phase) * 2;
    const glow = context.createRadialGradient(x, y, 0, x, y, 4);
    glow.addColorStop(0, `rgba(224, 236, 93, ${alpha})`);
    glow.addColorStop(1, "rgba(224, 236, 93, 0)");
    context.fillStyle = glow;
    context.fillRect(x - 4, y - 4, 8, 8);
  });
}

function renderScene(
  context: CanvasRenderingContext2D,
  time: number,
  config: SceneConfig,
  background?: HTMLImageElement,
) {
  if (background?.complete && background.naturalWidth > 0) {
    renderReferenceScene(context, time, background);
    return;
  }

  context.clearRect(0, 0, WIDTH, HEIGHT);

  const sky = context.createLinearGradient(0, 0, 0, 190);
  sky.addColorStop(0, "#061326");
  sky.addColorStop(0.58, "#0b274a");
  sky.addColorStop(1, "#244b70");
  context.fillStyle = sky;
  context.fillRect(0, 0, WIDTH, 190);

  stars.forEach((star) => {
    const twinkle =
      star.brightness *
      (0.52 + Math.sin(time * 0.7 + star.phase) * 0.24);
    context.fillStyle = `rgba(255, 225, 157, ${twinkle})`;
    context.fillRect(
      Math.round(star.x),
      Math.round(star.y),
      star.size,
      star.size,
    );
    if (star.size === 2) {
      context.fillRect(Math.round(star.x - 2), Math.round(star.y), 6, 1);
      context.fillRect(Math.round(star.x), Math.round(star.y - 2), 1, 6);
    }
  });

  if (config.features.showClouds) {
    drawCloud(context, 151 + Math.sin(time * 0.08) * 4, 53, 0.9, "#203f64");
    drawCloud(context, 358 - Math.sin(time * 0.06) * 5, 112, 0.62, "#2a4b70");
    drawCloud(context, 536 + Math.sin(time * 0.05) * 3, 83, 0.74, "#28486d");
    drawCloud(context, 78 - Math.sin(time * 0.07) * 3, 129, 0.52, "#305174");
  }

  if (config.features.showMoon) drawMoon(context, time);

  polygon(
    context,
    [[548, 182], [567, 169], [580, 175], [596, 164], [614, 178], [640, 181], [640, 191], [548, 191]],
    "#102c47",
  );
  context.fillStyle = "#24485f";
  context.fillRect(570, 174, 28, 2);

  if (config.features.showLighthouse) drawLighthouse(context, time);
  drawOcean(context, time);
  drawBeach(context, time);
  drawMeadow(context);
  drawGrassAndFlowers(context, time);
  if (config.features.showLantern) drawLantern(context, time);
  if (config.features.showAnimals) {
    drawCat(context, time);
    drawRabbit(context, time);
  }
  drawCharacter(context, time);
  drawAtmosphere(context, time);
}

export default function PixelCanvasScene({ config }: PixelCanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    context.imageSmoothingEnabled = false;
    let frame = 0;
    const start = performance.now();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const background = new Image();
    background.decoding = "async";
    background.onload = () => {
      if (reduceMotion) renderScene(context, 8, config, background);
    };
    background.src = "/images/drift-ocean-reference.png";

    function draw(now: number) {
      const elapsed = reduceMotion ? 8 : (now - start) / 1000;
      renderScene(context!, elapsed, config, background);
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [config]);

  return (
    <div className="canvas-stage" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="pixel-canvas"
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  );
}
