"use client";

import "./wave-portfolio.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import WaveScene from "@/components/three/WaveScene";
import { useAudioReactive } from "@/hooks/useAudioReactive";

const SUBTITLE_TEXT = "Wellcome Journey Through My Creative Portfolio";

/* ---- ANIMATED CURSOR (from .ani file) ---- */
const CURSOR_FRAMES = [
  "/images/cursor-frames/frame-00.png",
  "/images/cursor-frames/frame-01.png",
];
const CURSOR_FRAME_DELAY = 500; // ms per frame

function AniCursor({ active }: { active: boolean }) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setFrameIdx((i) => (i + 1) % CURSOR_FRAMES.length);
    }, CURSOR_FRAME_DELAY);
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const handleMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [active]);

  // Apply cursor:none to body when active
  useEffect(() => {
    if (active && mounted) {
      document.body.style.cursor = "none";
      return () => { document.body.style.cursor = ""; };
    }
  }, [active, mounted]);

  if (!active || !mounted) return null;

  return createPortal(
    <div
      ref={cursorRef}
      className="ani-cursor"
      style={{ backgroundImage: `url(${CURSOR_FRAMES[frameIdx]})` }}
    />,
    document.body
  );
}
const GREETING_TEXT = "Hi, I'm Yafei";

function useTypewriter(text: string, startDelay: number = 1000) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    let charIndex = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      if (elapsed < startDelay) {
        frame = requestAnimationFrame(animate);
        return;
      }
      const progress = elapsed - startDelay;
      const targetIndex = Math.min(text.length, Math.floor(progress / 55));
      if (targetIndex > charIndex) {
        charIndex = targetIndex;
        setDisplayed(text.slice(0, charIndex));
      }
      if (charIndex >= text.length) {
        setDone(true);
        return;
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [text, startDelay]);

  return { displayed, done };
}

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
];

const projects = [
  {
    id: 1,
    title: "Product Design",
    description: "Exploring Product Design That Cares for Daily Life and Connects People With Objects",
    tagline: "关照日常，联结人与物的产品设计探索",
    color: "#1a1a3a",
    accent: "#8b5cf6",
    image: "/images/projects/leetmemo.png",
    tags: [],
    folders: [
      {
        id: "product",
        icon: "🎨",
        label: "Product Design",
        groups: [
          {
            id: "pd1",
            label: "Product Design I",
            cover: "/images/projects/leetmemo-gallery/1/A4%20-%201.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%201.png", alt: "Product Design I" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%202.png", alt: "Smart Health Cutting Board" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%203.png", alt: "Smart Health Cutting Board Cover" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%204.png", alt: "Smart Kitchen Market Analysis" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%205.png", alt: "Traditional Cutting Board Pain Points" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%206.png", alt: "Smart Cutting Board Design Concept" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%207.png", alt: "Product Design Sketch" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%208.png", alt: "Product Design Prototype" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%209.png", alt: "Product Design Detail" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%2010.png", alt: "Product Design Analysis" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%2011.png", alt: "Product Design Process" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%2012.png", alt: "Product Design Final" },
              { src: "/images/projects/leetmemo-gallery/1/A4%20-%2013.png", alt: "Product Design Showcase" },
            ],
          },
          {
            id: "pd2",
            label: "Product Design II",
            cover: "/images/projects/leetmemo-gallery/2/A4%20-%2014.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2014.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2015.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2016.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2017.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2018.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2019.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2020.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2021.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2022.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2023.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2024%20.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2025%20.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2026%20.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2027.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2028.png", alt: "Product Design II" },
              { src: "/images/projects/leetmemo-gallery/2/A4%20-%2029.png", alt: "Product Design II" },
            ],
          },
          {
            id: "pd3",
            label: "Product Design III",
            cover: "/images/projects/leetmemo-gallery/3/A4%20-%2030.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2030.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2031.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2032.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2033.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2034.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2035.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2036.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2037.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2038.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2039.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2040.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2041.png", alt: "Product Design III" },
              { src: "/images/projects/leetmemo-gallery/3/A4%20-%2042.png", alt: "Product Design III" },
            ],
          },
        ],
      },
      {
        id: "cultural",
        icon: "🌏",
        label: "Cultural & Creative Design",
        groups: [
          {
            id: "cc1",
            label: "Design 1",
            cover: "/images/projects/leetmemo-gallery/4/A4%20-%2041.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2041.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2046.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2047.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2048.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2049.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2050.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2051.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2052.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2054.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2055.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2056.png", alt: "Cultural and Creative Design 1" },
              { src: "/images/projects/leetmemo-gallery/4/A4%20-%2073.png", alt: "Cultural and Creative Design 1" },
            ],
          },
          {
            id: "cc2",
            label: "Design 2",
            cover: "/images/projects/leetmemo-gallery/5/A4%20-%2058.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2058.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2059.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2060.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2065.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2066.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2067.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2068.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2069.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2070.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2071.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2072.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2073.png", alt: "Cultural and Creative Design 2" },
              { src: "/images/projects/leetmemo-gallery/5/A4%20-%2074.png", alt: "Cultural and Creative Design 2" },
            ],
          },
        ],
      },
      {
        id: "toys",
        icon: "🧸",
        label: "Infant Sensory Toys",
        groups: [
          {
            id: "toys1",
            label: "Sensory Toys",
            cover: "/images/projects/leetmemo-gallery/6/A4%20-%2065.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2065.png", alt: "Systematic Design of Progressive Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2066.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2067.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2068.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2069.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2070.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2071.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2072.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2073.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2074.png", alt: "Infant Sensory Toys" },
              { src: "/images/projects/leetmemo-gallery/6/A4%20-%2075.png", alt: "Infant Sensory Toys" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "FOCUS",
    description: "Experimental typographic exploration — FOCUS / EXPLORE / BREAKTHROUGH.",
    tagline: "聚焦视觉 · 探索边界 · 突破想象",
    color: "#2a2a4a",
    accent: "#ec4899",
    image: "/images/projects/leetmemo-gallery/8/1.png",
    tags: ["Branding", "Typography"],
    links: [
      { icon: "🎨", label: "查看设计作品", href: "#" },
      { icon: "💡", label: "设计理念", href: "#" },
    ],
    folders: [
      {
        id: "focus-design",
        icon: "🎯",
        label: "Focus Design",
        groups: [
          {
            id: "fd1",
            label: "Focus Gallery",
            cover: "/images/projects/leetmemo-gallery/8/1.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/8/1.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/2.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/3.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/4.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/5.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/6.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/7.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/8.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/9.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/10.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/11.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/12.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/13.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/14.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/15.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/16.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/17.png", alt: "FOCUS" },
              { src: "/images/projects/leetmemo-gallery/8/18.png", alt: "FOCUS" },
            ],
          },
          {
            id: "fd2",
            label: "Nature Visual",
            cover: "/images/projects/leetmemo-gallery/8/%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B9/12.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/8/%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B9/12.png", alt: "Nature Visual 12" },
              { src: "/images/projects/leetmemo-gallery/8/%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B9/13.png", alt: "Nature Visual 13" },
              { src: "/images/projects/leetmemo-gallery/8/%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B9/14.png", alt: "Nature Visual 14" },
              { src: "/images/projects/leetmemo-gallery/8/%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B9/15.png", alt: "Nature Visual 15" },
              { src: "/images/projects/leetmemo-gallery/8/%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B9/16.png", alt: "Nature Visual 16" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Amazon E-commerce Visual Design",
    description: "Amazon e-commerce visual system — product visualization, brand storytelling, and purchase journey design.",
    tagline: "亚马逊电商视觉体系 · 产品可视化 · 品牌叙事 · 购买路径设计",
    year: "2024",
    color: "#1e1e3e",
    accent: "#06b6d4",
    image: "/images/projects/leetmemo-gallery/9/1.png",
    tags: ["E-commerce", "Branding", "Visual"],
    links: [
      { icon: "🛒", label: "查看详情", href: "#" },
      { icon: "📦", label: "设计案例", href: "#" },
    ],
    folders: [
      {
        id: "aurora",
        icon: "🛒",
        label: "Amazon E-commerce Visual Design",
        groups: [
          {
            id: "ac1",
            label: "Amazon Visual Gallery",
            cover: "/images/projects/leetmemo-gallery/9/1.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/9/1.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/2.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/3.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/4.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/5.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/6.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/7.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/8.png", alt: "Amazon E-commerce Visual Design" },
              { src: "/images/projects/leetmemo-gallery/9/9.png", alt: "Amazon E-commerce Visual Design" },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 5,
    title: "Order food",
    description: "Embedded Figma prototype — interactive preview.",
    tagline: "点餐交互原型 · 可交互演示",
    color: "#1f1f3f",
    accent: "#10b981",
    image: "",
    tags: ["Figma", "Prototype", "Interactive"],
    embed: {
      src: "https://embed.figma.com/proto/fuwUuSdyfemaX4QBdYjHS1/Untitled?page-id=0%3A1&starting-point-node-id=62%3A92&embed-host=share",
      title: "Order food Figma Prototype",
    },
    folders: [
      {
        id: "untitled-gallery",
        icon: "🖼",
        label: "Gallery",
        groups: [
          {
            id: "ug1",
            label: "Design Set",
            cover: "/images/projects/leetmemo-gallery/7/A4%20-%2089.png",
            items: [
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2089.png", alt: "Untitled Design 1" },
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2090.png", alt: "Untitled Design 2" },
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2092.png", alt: "Untitled Design 3" },
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2093.png", alt: "Untitled Design 4" },
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2094.png", alt: "Untitled Design 5" },
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2095.png", alt: "Untitled Design 6" },
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2096.png", alt: "Untitled Design 7" },
              { src: "/images/projects/leetmemo-gallery/7/A4%20-%2097.png", alt: "Untitled Design 8" },
            ],
          },
        ],
      },
    ],
    links: [
      { icon: "🔗", label: "在 Figma 中打开", href: "https://www.figma.com/proto/fuwUuSdyfemaX4QBdYjHS1/Untitled" },
    ],
  },
];

const aboutSections = {
  aboutMe: "I am a product design student passionate about creating meaningful experiences that bridge people and technology. My design philosophy centers on simplicity, empathy, and attention to detail — every pixel, every interaction, every curve serves a purpose. I believe great design is invisible; it just works.",
  interests: "Beyond design, I am fascinated by photography, film aesthetics, and the emotional power of music. I enjoy exploring how visual narratives shape our perception of the world. In my free time, you will find me sketching, collecting vinyl records, or diving into indie games that push creative boundaries.",
  softwareSkills: [
    { category: "Modeling & Rendering", tools: "Blender, Rhino, KeyShot, Cinema 4D" },
    { category: "Graphic Design", tools: "Figma, Adobe Photoshop, Illustrator, InDesign, After Effects" },
    { category: "AI Tools", tools: "Midjourney, Stable Diffusion, DALL-E, ComfyUI, Runway" },
  ],
};

function IDBadge() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 20 });
  const sy = useSpring(my, { stiffness: 250, damping: 20 });
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const rotateX = useTransform(sy, [-15, 15], [15, -15]);
  const rotateY = useTransform(sx, [-15, 15], [-15, 15]);

  const glossX = useTransform(sx, [-15, 15], ["10%", "90%"]);
  const glossY = useTransform(sy, [-15, 15], ["10%", "90%"]);

  const glowX = useTransform(sx, [-15, 15], ["0%", "100%"]);
  const glowY = useTransform(sy, [-15, 15], ["0%", "100%"]);

  const frontGlossBg = useTransform(
    [glossX, glossY] as any,
    ([x, y]: any) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.15) 0%, transparent 60%)`
  );

  const frontGlowBg = useTransform(
    [glowX, glowY] as any,
    ([x, y]: any) => `radial-gradient(circle at ${x} ${y}, rgba(168,85,247,0.45) 0%, rgba(168,85,247,0.12) 40%, transparent 70%)`
  );

  const [qrPattern, setQrPattern] = useState<boolean[]>([]);
  useEffect(() => {
    setQrPattern(Array.from({ length: 100 }).map(() => Math.random() > 0.5));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 18);
    my.set(y * -18);
  }, [mx, my, isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) return;
    mx.set(0);
    my.set(0);
  }, [mx, my, isDragging]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback((_: any, info: any) => {
    mx.set(-info.offset.x * 0.15);
    my.set(info.offset.y * 0.15);
  }, [mx, my]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const handleCardClick = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  return (
    <div className="id-badge-wrap" ref={wrapRef}>
      <motion.div
        className="id-lanyard"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        drag
        dragConstraints={{ left: -120, right: 120, top: -150, bottom: 150 }}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="id-glow"
          style={{ background: frontGlowBg as any }}
        />

        <div className="id-strap" />
        <div className="id-ring" />
        <div className="id-connector" />

        <motion.div
          className="id-card"
          style={{
            transformStyle: "preserve-3d",
            rotateY: flipped ? 180 : 0,
          }}
          onClick={handleCardClick}
        >
          <div className="id-face id-face-front">
            <div className="id-header-strip">
              <span className="id-badge-id">#ID-0902</span>
            </div>

            <div className="id-avatar">
              <div className="id-avatar-inner">
                <img src="/images/1dbe76cf48229af427c0c3cf545af4cd.png" alt="Yafei" />
              </div>
            </div>

            <div className="id-name">
              Yafei Zhang
              <span>27届产品设计</span>
            </div>

            <div className="id-role">job seeker</div>

            <div className="id-contact-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              2947466559@qq.com
            </div>

            <motion.div
              className="id-gloss"
              style={{ background: frontGlossBg as any, opacity: 0.6 }}
            />
          </div>

          <div className="id-face id-face-back">
            <h4>Contact Info</h4>

            <div className="id-qr">
              <img src="/images/wechat-qr.png" alt="WeChat QR" />

            </div>
            <div className="id-info-row">
              <span className="id-info-label">Email</span>
              <span className="id-info-value">2947466559@qq.com</span>
            </div>
            <div className="id-info-row">
              <span className="id-info-label">Location</span>
              <span className="id-info-value">China</span>
            </div>
            <div className="id-info-row">
              <span className="id-info-label">Phone</span>
              <span className="id-info-value">18703677373</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const gallery = (project as any).gallery as { src: string; alt: string }[] | undefined;

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const prevImage = useCallback(() => {
    if (!gallery) return;
    setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length);
  }, [gallery]);

  const nextImage = useCallback(() => {
    if (!gallery) return;
    setLightboxIndex((i) => (i + 1) % gallery.length);
  }, [gallery]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, closeLightbox, prevImage, nextImage]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 10);
    my.set(y * -10);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const rotateX = useTransform(sy, [-5, 5], [5, -5]);
  const rotateY = useTransform(sx, [-5, 5], [-5, 5]);
  const hoverLift = useTransform(sy, [-5, 5], [8, -8]);
  const hoverScale = useTransform([sx, sy], ([x, y]: number[]) => 1 + (Math.abs(x) + Math.abs(y)) * 0.004);

  const glossX = useTransform(sx, [-5, 5], ["20%", "80%"]);
  const glossY = useTransform(sy, [-5, 5], ["20%", "80%"]);
  const glossBg = useTransform(
    [glossX, glossY],
    ([x, y]) => `radial-gradient(ellipse at ${x} ${y}, ${project.accent}50 0%, transparent 50%)`
  );

  const titleX = useTransform(sx, [-5, 5], [-4, 4]);
  const titleY = useTransform(sy, [-5, 5], [-2, 2]);
  const descX = useTransform(sx, [-5, 5], [-2, 2]);
  const descY = useTransform(sy, [-5, 5], [-1.5, 1.5]);
  const tagsX = useTransform(sx, [-5, 5], [-1.5, 1.5]);

  return (
    <>
      <motion.div
        ref={cardRef}
        className="wave-project-card"
        style={{
          rotateX,
          rotateY,
          y: hoverLift,
          scale: hoverScale,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="wave-project-visual"
          style={
            project.image
              ? {
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { backgroundColor: project.color }
          }
        >
          <div
            className="wave-project-accent"
            style={{ background: `linear-gradient(135deg, ${project.accent}40 0%, transparent 60%)` }}
          />
          <motion.div
            className="wave-project-gloss"
            style={{ background: glossBg }}
          />
          <div className="wave-project-visual-overlay" />
          <span className="wave-project-year">{project.year}</span>
        </div>

        <div className="wave-project-caption">
          <span className="wave-project-caption-title">{project.title}</span>
        </div>
      </motion.div>

      {lightboxOpen && gallery && (
        <motion.div
          className="wave-lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="wave-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ✕
          </button>
          <button
            type="button"
            className="wave-lightbox-nav wave-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <motion.div
            className="wave-lightbox-content"
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[lightboxIndex].src}
              alt={gallery[lightboxIndex].alt}
              className="wave-lightbox-image"
            />
            <div className="wave-lightbox-caption">
              {gallery[lightboxIndex].alt}
              <span className="wave-lightbox-counter">
                {lightboxIndex + 1} / {gallery.length}
              </span>
            </div>
          </motion.div>
          <button
            type="button"
            className="wave-lightbox-nav wave-lightbox-next"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
          >
            ›
          </button>
        </motion.div>
      )}
    </>
  );
}

type Project = typeof projects[0];
type AppType = "notepad" | "calculator" | "about" | "mycomputer" | "paint" | "recyclebin";
type WinState = {
  id: number;
  projectId?: number;
  appType?: AppType;
  title: string;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  forceFullscreen?: boolean;
};

const DESKTOP_APPS: { type: AppType; title: string; icon: string; label: string }[] = [
  { type: "notepad", title: "Notepad", icon: "📝", label: "Notepad" },
  { type: "calculator", title: "Calculator", icon: "🧮", label: "Calculator" },
  { type: "about", title: "About Yafei", icon: "🆔", label: "About" },
  { type: "mycomputer", title: "My Computer", icon: "💻", label: "My Computer" },
  { type: "paint", title: "Paint", icon: "🎨", label: "Paint" },
  { type: "recyclebin", title: "Recycle Bin", icon: "🗑️", label: "Recycle Bin" },
];

function ProjectDetailView({ project, onFullscreenChange, forceFullscreen, onCloseWindow }: { project: Project; onFullscreenChange?: (fs: boolean) => void; forceFullscreen?: boolean; onCloseWindow?: () => void }) {
  const folders = (project as any).folders as {
    id: string;
    icon: string;
    label: string;
    groups: { id: string; label: string; cover: string; items: { src: string; alt: string }[] }[];
  }[] | undefined;
  const links = (project as any).links as { icon: string; label: string; href: string }[] | undefined;
  const tagline = (project as any).tagline as string | undefined;
  const embed = (project as any).embed as { src: string; title?: string } | undefined;
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewingGroup, setViewingGroup] = useState<{ folderId: string; groupId: string; label: string } | null>(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);
  const fullscreenItemsRef = useRef<{ src: string; alt: string }[]>([]);

  const currentItems = (() => {
    if (!viewingGroup || !folders) return [];
    const folder = folders.find((f) => f.id === viewingGroup.folderId);
    const group = folder?.groups.find((g) => g.id === viewingGroup.groupId);
    return group?.items ?? [];
  })();

  const scrollToFolder = useCallback((id: string) => {
    setSelectedFolder(id);
    const el = sectionRefs.current[id];
    if (el) {
      const container = el.closest(".retro-win-body") as HTMLElement | null;
      if (container) {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offset = rect.top - containerRect.top + container.scrollTop - 8;
        container.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  }, []);

  const openGroup = useCallback((folderId: string, groupId: string, label: string, items: { src: string; alt: string }[], startIdx = 0) => {
    setViewingGroup({ folderId, groupId, label });
    setViewIndex(startIdx);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const closeGroup = useCallback(() => {
    const folderId = viewingGroup?.folderId;
    setViewingGroup(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (folderId) {
      requestAnimationFrame(() => {
        setTimeout(() => scrollToFolder(folderId), 50);
      });
    }
  }, [viewingGroup, scrollToFolder]);

  const snapTo5 = (v: number) => Math.round(v * 20) / 20;
  const zoomIn = useCallback(() => { setZoom((z) => snapTo5(Math.min(snapTo5(z) + 0.05, 4))); setPan({ x: 0, y: 0 }); }, []);
  const zoomOut = useCallback(() => { setZoom((z) => snapTo5(Math.max(snapTo5(z) - 0.05, 0.25))); setPan({ x: 0, y: 0 }); }, []);
  const resetZoom = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  const onWheelZoom = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom((z) => {
      const snapped = snapTo5(z);
      const next = snapped + (e.deltaY < 0 ? 0.05 : -0.05);
      return snapTo5(Math.max(0.25, Math.min(next, 4)));
    });
    setPan({ x: 0, y: 0 });
  }, []);

  const onImgPointerDown = useCallback((e: React.PointerEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [zoom, pan]);

  const onImgPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  }, []);

  const onImgPointerUp = useCallback(() => { dragRef.current = null; }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((idx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const child = container.children[idx] as HTMLElement | undefined;
    if (child) {
      container.scrollTo({ top: child.offsetTop, behavior: "smooth" });
    }
  }, []);

  const prevImage = useCallback(() => {
    if (!currentItems.length) return;
    const newIdx = (viewIndex - 1 + currentItems.length) % currentItems.length;
    setViewIndex(newIdx);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    scrollToIndex(newIdx);
  }, [currentItems.length, viewIndex, scrollToIndex]);

  const nextImage = useCallback(() => {
    if (!currentItems.length) return;
    const newIdx = (viewIndex + 1) % currentItems.length;
    setViewIndex(newIdx);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    scrollToIndex(newIdx);
  }, [currentItems.length, viewIndex, scrollToIndex]);

  const showAndHideControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  }, []);

  const openFullscreen = useCallback((idx: number, items?: { src: string; alt: string }[]) => {
    if (items) fullscreenItemsRef.current = items;
    setFullscreenIdx(idx);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenIdx(null);
  }, []);

  const fullscreenPrev = useCallback(() => {
    const total = fullscreenItemsRef.current.length;
    if (fullscreenIdx === null || !total) return;
    setFullscreenIdx((i) => (i === null ? 0 : (i - 1 + total) % total));
  }, [fullscreenIdx]);

  const fullscreenNext = useCallback(() => {
    const total = fullscreenItemsRef.current.length;
    if (fullscreenIdx === null || !total) return;
    setFullscreenIdx((i) => (i === null ? 0 : (i + 1) % total));
  }, [fullscreenIdx]);

useEffect(() => {
    if (!viewingGroup) return;
    setShowControls(true);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 2500);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGroup();
      if (e.key === "ArrowUp") { e.preventDefault(); prevImage(); showAndHideControls(); }
      if (e.key === "ArrowDown") { e.preventDefault(); nextImage(); showAndHideControls(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [viewingGroup, closeGroup, prevImage, nextImage, showAndHideControls]);

  const onScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const scrollTop = container.scrollTop;
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetTop - scrollTop);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    if (closest !== viewIndex) setViewIndex(closest);
  }, [viewIndex]);

  useEffect(() => {
    onFullscreenChange?.(!!viewingGroup);
  }, [viewingGroup, onFullscreenChange]);

  useEffect(() => {
    if (fullscreenIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowLeft") { e.preventDefault(); fullscreenPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); fullscreenNext(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreenIdx, closeFullscreen, fullscreenPrev, fullscreenNext]);

  const totalItems = (f: typeof folders extends (infer U)[] | undefined ? U : never) =>
    f?.groups.reduce((s, g) => s + g.items.length, 0) ?? 0;

  const [embedFullscreen, setEmbedFullscreen] = useState(false);
  const [embedView, setEmbedView] = useState<"prototype" | "gallery">("prototype");
  const [embedZoom, setEmbedZoom] = useState(1);
  const [embedPan, setEmbedPan] = useState({ x: 0, y: 0 });
  const embedDragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
const [embedReady, setEmbedReady] = useState(true);
const [embedLoading, setEmbedLoading] = useState(true);

  useEffect(() => {
    if (!embedFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEmbedFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [embedFullscreen]);

  const snapTo5Embed = (v: number) => Math.round(v * 20) / 20;
  const embedZoomIn = useCallback(() => {
    setEmbedZoom((z) => snapTo5Embed(Math.min(snapTo5Embed(z) + 0.05, 3)));
    setEmbedPan({ x: 0, y: 0 });
  }, []);
  const embedZoomOut = useCallback(() => {
    setEmbedZoom((z) => snapTo5Embed(Math.max(snapTo5Embed(z) - 0.05, 0.5)));
    setEmbedPan({ x: 0, y: 0 });
  }, []);
  const embedResetZoom = useCallback(() => {
    setEmbedZoom(1);
    setEmbedPan({ x: 0, y: 0 });
  }, []);

  const onEmbedWheelZoom = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setEmbedZoom((z) => {
      const snapped = snapTo5Embed(z);
      const next = snapped + (e.deltaY < 0 ? 0.05 : -0.05);
      return snapTo5Embed(Math.max(0.5, Math.min(next, 3)));
    });
    setEmbedPan({ x: 0, y: 0 });
  }, []);

  const onEmbedPointerDown = useCallback((e: React.PointerEvent) => {
    if (embedZoom <= 1) return;
    e.preventDefault();
    embedDragRef.current = { startX: e.clientX, startY: e.clientY, panX: embedPan.x, panY: embedPan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [embedZoom, embedPan]);

  const onEmbedPointerMove = useCallback((e: React.PointerEvent) => {
    if (!embedDragRef.current) return;
    const dx = e.clientX - embedDragRef.current.startX;
    const dy = e.clientY - embedDragRef.current.startY;
    setEmbedPan({ x: embedDragRef.current.panX + dx, y: embedDragRef.current.panY + dy });
  }, []);

  const onEmbedPointerUp = useCallback(() => {
    embedDragRef.current = null;
  }, []);

  if (embed) {
    const galleryItems = folders?.flatMap((f) => f.groups.flatMap((g) => g.items)) ?? [];
    const hideWindowContent = embedFullscreen && embedView === "prototype";
    return (
      <>
      <div className="retro-project-detail retro-project-embed">
        {!hideWindowContent && (
        <div className="retro-embed-header">
          <span className="retro-embed-title">🎨 {project.title}</span>
          {tagline && <span className="retro-embed-tagline">{tagline}</span>}
          <div className="retro-embed-tabs">
            <button
              type="button"
              className={`retro-embed-tab ${embedView === "prototype" ? "is-active" : ""}`}
              onClick={() => setEmbedView("prototype")}
            >
              📱 原型
            </button>
            {galleryItems.length > 0 && (
              <button
                type="button"
                className={`retro-embed-tab ${embedView === "gallery" ? "is-active" : ""}`}
                onClick={() => setEmbedView("gallery")}
              >
                🖼 图集 ({galleryItems.length})
              </button>
            )}
          </div>
          {embedView === "prototype" && (
            <button
              type="button"
              className="retro-embed-fs-btn"
              onClick={() => setEmbedFullscreen(true)}
              title="全屏预览"
            >
              ⛶ 全屏
            </button>
          )}
          {links && links.length > 0 && (
            <a
              className="retro-embed-link"
              href={links[0].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links[0].icon} {links[0].label} ↗
            </a>
          )}
        </div>
        )}
        {hideWindowContent ? (
          <div className="retro-embed-placeholder">已进入全屏模式</div>
        ) : embedView === "prototype" ? (
            <div className="retro-embed-frame-wrap">
              {embedLoading && (
                <div className="retro-embed-loading">
                  <div className="retro-embed-spinner" />
                  <span>加载交互原型中...</span>
                </div>
              )}
              <div className="retro-embed-fs-zoom-controls" style={{ position: 'absolute', top: 8, right: 8, left: 'auto', transform: 'none' }} onClick={(e) => e.stopPropagation()}>
                <button type="button" className="retro-inline-zoom-btn" onClick={(e) => { e.stopPropagation(); embedZoomOut(); }} aria-label="Zoom out">−</button>
                <span className="retro-inline-zoom-label" onClick={(e) => { e.stopPropagation(); embedResetZoom(); }}>{Math.round(embedZoom * 100)}%</span>
                <button type="button" className="retro-inline-zoom-btn" onClick={(e) => { e.stopPropagation(); embedZoomIn(); }} aria-label="Zoom in">+</button>
                <button type="button" className="retro-inline-zoom-btn retro-inline-fs-btn" onClick={(e) => { e.stopPropagation(); setEmbedFullscreen(true); }} aria-label="Fullscreen" title="全屏">⛶</button>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                onWheel={onEmbedWheelZoom}
              >
                <iframe
                  className="retro-embed-frame"
                  src={embed.src}
                  {...({ loading: "eager", fetchPriority: "high" } as React.IframeHTMLAttributes<HTMLIFrameElement>)}
                  title={embed.title || project.title}
                  allowFullScreen
                  onLoad={() => setEmbedLoading(false)}
                  style={{
                    transform: `translate(${embedPan.x}px, ${embedPan.y}px) scale(${embedZoom})`,
                    transformOrigin: 'center center',
                    transition: embedDragRef.current ? 'none' : 'transform 0.15s ease',
                    cursor: embedZoom > 1 ? 'grab' : 'default',
                    opacity: embedLoading ? 0 : 1,
                  }}
                  onPointerDown={onEmbedPointerDown}
                  onPointerMove={onEmbedPointerMove}
                  onPointerUp={onEmbedPointerUp}
                />
              </div>
            </div>
        ) : (
          <div className="retro-embed-gallery">
            {folders?.map((f) => (
              <div key={f.id} className="retro-embed-gallery-section">
                <div className="retro-embed-gallery-title">{f.icon} {f.label}</div>
                <div className="retro-embed-gallery-grid">
                  {f.groups.flatMap((g) => g.items).map((item, i) => (
                    <div
                      key={i}
                      className="retro-embed-gallery-thumb"
                      style={{ backgroundImage: `url(${item.src})` }}
                      onClick={() => openFullscreen(i, galleryItems)}
                      role="button"
                      tabIndex={0}
                      title={item.alt}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {embedView === "prototype" && embedFullscreen && createPortal(
        <motion.div
          className="wave-fullscreen-overlay retro-embed-fullscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEmbedFullscreen(false)}
          onWheel={onEmbedWheelZoom}
        >
          <button
            type="button"
            className="wave-fullscreen-close"
            onClick={(e) => { e.stopPropagation(); setEmbedFullscreen(false); }}
            aria-label="Close fullscreen"
          >
            ✕
          </button>
          <div className="retro-embed-fs-zoom-controls" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="retro-inline-zoom-btn" onClick={(e) => { e.stopPropagation(); embedZoomOut(); }} aria-label="Zoom out">−</button>
            <span className="retro-inline-zoom-label" onClick={(e) => { e.stopPropagation(); embedResetZoom(); }}>{Math.round(embedZoom * 100)}%</span>
            <button type="button" className="retro-inline-zoom-btn" onClick={(e) => { e.stopPropagation(); embedZoomIn(); }} aria-label="Zoom in">+</button>
          </div>
          <motion.div
            className="retro-embed-fullscreen-frame"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embed.src}
              title={embed.title || project.title}
              allowFullScreen
              style={{
                transform: `translate(${embedPan.x}px, ${embedPan.y}px) scale(${embedZoom})`,
                transformOrigin: 'center center',
                transition: embedDragRef.current ? 'none' : 'transform 0.15s ease',
                cursor: embedZoom > 1 ? 'grab' : 'default',
              }}
              onPointerDown={onEmbedPointerDown}
              onPointerMove={onEmbedPointerMove}
              onPointerUp={onEmbedPointerUp}
            />
          </motion.div>
        </motion.div>,
        document.body
      )}
      {embedView === "gallery" && fullscreenIdx !== null && galleryItems[fullscreenIdx] && createPortal(
        <motion.div
          className="wave-fullscreen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeFullscreen}
        >
          <button
            type="button"
            className="wave-fullscreen-close"
            onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
            aria-label="Close fullscreen"
          >
            ✕
          </button>
          {galleryItems.length > 1 && (
            <button
              type="button"
              className="wave-fullscreen-nav wave-fullscreen-prev"
              onClick={(e) => { e.stopPropagation(); fullscreenPrev(); }}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}
          <motion.div
            className="wave-fullscreen-content"
            key={fullscreenIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryItems[fullscreenIdx].src}
              alt={galleryItems[fullscreenIdx].alt}
              className="wave-fullscreen-image"
            />
            <div className="wave-fullscreen-caption">
              <span>{galleryItems[fullscreenIdx].alt}</span>
              <span className="wave-fullscreen-counter">
                {fullscreenIdx + 1} / {galleryItems.length}
              </span>
            </div>
          </motion.div>
          {galleryItems.length > 1 && (
            <button
              type="button"
              className="wave-fullscreen-nav wave-fullscreen-next"
              onClick={(e) => { e.stopPropagation(); fullscreenNext(); }}
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </motion.div>,
        document.body
      )}
      </>
    );
  }

  return (
    <>
    <div className="retro-project-detail">
      {viewingGroup ? (
        <motion.div
          className="retro-inline-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseMove={showAndHideControls}
          onMouseLeave={() => setShowControls(false)}
        >
          <motion.div
            className="retro-inline-viewer-toolbar"
            style={{ pointerEvents: showControls ? 'auto' : 'none' }}
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
            transition={{ duration: 0.2 }}
          >
            <button type="button" className="retro-inline-back-btn" onClick={closeGroup}>
              ‹ Back
            </button>
            <span className="retro-inline-viewer-title">{viewIndex + 1} / {currentItems.length}</span>
            <div className="retro-inline-zoom-controls">
              <button type="button" className="retro-inline-zoom-btn" onClick={zoomOut} aria-label="Zoom out">−</button>
              <span className="retro-inline-zoom-label" onClick={resetZoom}>{Math.round(zoom * 100)}%</span>
              <button type="button" className="retro-inline-zoom-btn" onClick={zoomIn} aria-label="Zoom in">+</button>
              <button
                type="button"
                className="retro-inline-zoom-btn retro-inline-fs-btn"
                onClick={() => openFullscreen(viewIndex, currentItems)}
                aria-label="Fullscreen"
                title="全屏查看"
              >
                ⛶
              </button>
            </div>
          </motion.div>
          <div className="retro-inline-viewer-body" ref={scrollContainerRef} onScroll={onScroll} onWheel={onWheelZoom}>
            {currentItems.map((item, i) => (
              <div className="retro-inline-viewer-slide" key={i}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="retro-inline-viewer-image"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: dragRef.current ? 'none' : 'transform 0.15s ease',
                    cursor: zoom > 1 ? 'grab' : 'zoom-in',
                  }}
                  onClick={() => { if (zoom === 1) openFullscreen(i, currentItems); }}
                  onDoubleClick={() => (zoom === 1 ? setZoom(2) : setZoom(1))}
                  onPointerDown={onImgPointerDown}
                  onPointerMove={onImgPointerMove}
                  onPointerUp={onImgPointerUp}
                  onPointerCancel={onImgPointerUp}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          <div
            className="retro-project-cover"
            style={
              project.image
                ? {
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                : { backgroundColor: project.color }
            }
          >
            <div className="retro-cover-overlay" />
            {project.year && <div className="retro-cover-year">{project.year}</div>}
          </div>

          <div className="retro-project-body">
        <h3 className="retro-project-title">{project.title}</h3>
        {tagline && <p className="retro-project-tagline">{tagline}</p>}
        <p className="retro-project-desc">{project.description}</p>

        {project.tags && project.tags.length > 0 && (
          <div className="retro-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="retro-tag">{tag}</span>
            ))}
          </div>
        )}

        {folders && folders.length > 0 && (
          <>
            {folders.map((f) => (
              <div
                key={f.id}
                className="retro-folder-section"
                ref={(el) => { sectionRefs.current[f.id] = el; }}
                id={`folder-${f.id}`}
              >
                <div className="retro-folder-section-titlebar">
                  <span className="retro-folder-section-title">{f.icon} {f.label}</span>
                  <span className="retro-folder-section-count">
                    {f.groups.length} sub-group{f.groups.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="retro-folder-section-body">
                  {f.groups.map((g) => (
                    <div key={g.id} className="retro-subgroup">
                      <div className="retro-subgroup-title">▸ {g.label}</div>
                      <div className="retro-subgroup-grid is-single">
                        <div
                          className="retro-folder-thumb"
                          onClick={() => openGroup(f.id, g.id, g.label, g.items)}
                          style={{ backgroundImage: `url(${g.cover})` }}
                          role="button"
                          tabIndex={0}
                        >
                          <span className="retro-folder-thumb-label">{g.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
        </>
      )}
    </div>
    {fullscreenIdx !== null && currentItems[fullscreenIdx] && createPortal(
      <motion.div
        className="wave-fullscreen-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeFullscreen}
      >
        <button
          type="button"
          className="wave-fullscreen-close"
          onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
          aria-label="Close fullscreen"
        >
          ✕
        </button>
        {currentItems.length > 1 && (
          <button
            type="button"
            className="wave-fullscreen-nav wave-fullscreen-prev"
            onClick={(e) => { e.stopPropagation(); fullscreenPrev(); }}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}
        <motion.div
          className="wave-fullscreen-content"
          key={fullscreenIdx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentItems[fullscreenIdx].src}
            alt={currentItems[fullscreenIdx].alt}
            className="wave-fullscreen-image"
          />
          <div className="wave-fullscreen-caption">
            <span>{currentItems[fullscreenIdx].alt}</span>
            <span className="wave-fullscreen-counter">
              {fullscreenIdx + 1} / {currentItems.length}
            </span>
          </div>
        </motion.div>
        {currentItems.length > 1 && (
          <button
            type="button"
            className="wave-fullscreen-nav wave-fullscreen-next"
            onClick={(e) => { e.stopPropagation(); fullscreenNext(); }}
            aria-label="Next image"
          >
            ›
          </button>
        )}
      </motion.div>,
      document.body
    )}
    </>
  );
}

function DesktopWindow({
  win,
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStart,
  onDrag,
  onDragEnd,
  isFullscreen = false,
  isEmbed = false,
  icon = "📁",
}: {
  win: WinState;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDragStart: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDrag: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  isFullscreen?: boolean;
  isEmbed?: boolean;
  icon?: string;
}) {
  const style: React.CSSProperties = win.maximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100% - 36px)", zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <motion.div
      className={`retro-window ${win.minimized ? "is-minimized" : ""} ${isFullscreen ? "is-fullscreen" : ""} ${isEmbed ? "is-embed" : ""}`}
      style={style}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={win.minimized ? { opacity: 0, scale: 0.9, y: 200 } : { opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 40 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseDown={onFocus}
    >
      {!isFullscreen && (
        <div
          className="retro-titlebar"
          onPointerDown={onDragStart}
          onPointerMove={onDrag}
          onPointerUp={onDragEnd}
          onDoubleClick={onMaximize}
        >
          <div className="retro-title-text">
            <span className="retro-title-icon">{icon}</span>
            <span>{title}</span>
          </div>
          <div className="retro-title-actions">
            <button type="button" className="retro-win-btn btn-min" onClick={onMinimize} aria-label="Minimize">
              <span>_</span>
            </button>
            <button type="button" className="retro-win-btn btn-max" onClick={onMaximize} aria-label="Maximize">
              <span>{win.maximized ? "❐" : "▢"}</span>
            </button>
            <button type="button" className="retro-win-btn btn-close" onClick={onClose} aria-label="Close">
              <span>✕</span>
            </button>
          </div>
        </div>
      )}

      {!isFullscreen && (
        <div className="retro-menubar">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Help</span>
        </div>
      )}

      <div className={`retro-win-body ${isFullscreen ? "is-fullscreen" : ""}`}>
        {children}
      </div>

      {!isFullscreen && (
        <div className="retro-win-statusbar">
          <span>Ready</span>
          <span className="retro-spacer" />
          <span>Yafei OS 98</span>
        </div>
      )}
    </motion.div>
  );
}

/* ---- RETRO NOTEPAD ---- */
function RetroNotepad() {
  const [text, setText] = useState("Welcome to YafeiOS 98!\r\n\r\nThis is a simple retro notepad.\r\nFeel free to type anything here...\r\n\r\n- Yafei's Portfolio -\r\nDesigned & Built with ❤️");
  return (
    <div className="retro-app notepad">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}

/* ---- RETRO CALCULATOR ---- */
function RetroCalculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<"+" | "-" | "×" | "÷" | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const input = (d: string) => {
    if (resetNext) { setDisplay(d); setResetNext(false); }
    else { setDisplay(display === "0" ? d : display + d); }
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); };
  const setOperator = (o: "+" | "-" | "×" | "÷") => {
    if (prev !== null && op) compute();
    else setPrev(parseFloat(display));
    setOp(o); setResetNext(true);
  };
  const compute = () => {
    if (prev === null || !op) return;
    const cur = parseFloat(display);
    let r = prev;
    if (op === "+") r += cur;
    if (op === "-") r -= cur;
    if (op === "×") r *= cur;
    if (op === "÷") r = cur === 0 ? 0 : r / cur;
    setDisplay(String(r));
    setPrev(r);
    setOp(null);
    setResetNext(true);
  };
  const equals = () => { compute(); setPrev(null); };

  return (
    <div className="retro-app calculator">
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        <button className="calc-btn calc-c" onClick={clear}>C</button>
        <button className="calc-btn" onClick={() => input("7")}>7</button>
        <button className="calc-btn" onClick={() => input("8")}>8</button>
        <button className="calc-btn" onClick={() => input("9")}>9</button>
        <button className="calc-btn calc-op" onClick={() => setOperator("÷")}>÷</button>
        <button className="calc-btn" onClick={() => input("4")}>4</button>
        <button className="calc-btn" onClick={() => input("5")}>5</button>
        <button className="calc-btn" onClick={() => input("6")}>6</button>
        <button className="calc-btn calc-op" onClick={() => setOperator("×")}>×</button>
        <button className="calc-btn" onClick={() => input("1")}>1</button>
        <button className="calc-btn" onClick={() => input("2")}>2</button>
        <button className="calc-btn" onClick={() => input("3")}>3</button>
        <button className="calc-btn calc-op" onClick={() => setOperator("-")}>-</button>
        <button className="calc-btn" onClick={() => input("0")}>0</button>
        <button className="calc-btn" onClick={() => input(".")}>.</button>
        <button className="calc-btn calc-eq" onClick={equals}>=</button>
        <button className="calc-btn calc-op" onClick={() => setOperator("+")}>+</button>
      </div>
    </div>
  );
}

/* ---- RETRO ABOUT ---- */
function RetroAbout() {
  return (
    <div className="retro-app about-app">
      <IDBadge />
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <img
          src="/images/b1d48af5337f638db8a75199e6f716de.png"
          alt="About Yafei"
          style={{ maxWidth: "100%", borderRadius: 8, border: "2px solid", borderColor: "#ffffff #808080 #808080 #ffffff" }}
        />
      </div>
    </div>
  );
}

/* ---- RETRO MY COMPUTER ---- */
function RetroMyComputer() {
  return (
    <div className="retro-app mycomputer">
      <div className="mc-drive">
        <div className="mc-drive-icon">🖴</div>
        <div className="mc-drive-info">
          <div className="mc-drive-name">3½ Floppy (A:)</div>
          <div className="mc-drive-detail">0 bytes free of 1.44 MB</div>
        </div>
      </div>
      <div className="mc-drive">
        <div className="mc-drive-icon">💽</div>
        <div className="mc-drive-info">
          <div className="mc-drive-name">Local Disk (C:)</div>
          <div className="mc-drive-detail">1.2 GB free of 4.0 GB</div>
        </div>
      </div>
      <div className="mc-drive">
        <div className="mc-drive-icon">💿</div>
        <div className="mc-drive-info">
          <div className="mc-drive-name">CD-ROM (D:)</div>
          <div className="mc-drive-detail">Yafei Portfolio CD</div>
        </div>
      </div>
      <div className="mc-divider" />
      <div className="mc-drive">
        <div className="mc-drive-icon">🖨️</div>
        <div className="mc-drive-info">
          <div className="mc-drive-name">Printers</div>
          <div className="mc-drive-detail">Add Printer</div>
        </div>
      </div>
      <div className="mc-drive">
        <div className="mc-drive-icon">🎮</div>
        <div className="mc-drive-info">
          <div className="mc-drive-name">Control Panel</div>
          <div className="mc-drive-detail">Configure system settings</div>
        </div>
      </div>
    </div>
  );
}

/* ---- RETRO PAINT ---- */
function RetroPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const colors = ["#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#FFFFFF", "#C0C0C0", "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"];

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const pos = getPos(e);
    // 画一个起始点，确保单击也有痕迹
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    lastPos.current = pos;
    setIsDrawing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const pos = getPos(e);
    if (lastPos.current) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  };
  const endDraw = () => { setIsDrawing(false); lastPos.current = null; };
  const clearCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="retro-app paint-app">
      <div className="paint-toolbar">
        <button className="paint-btn" onClick={clearCanvas}>🗑️ Clear</button>
        <div className="paint-colors">
          {colors.map((c) => (
            <button
              key={c}
              className={`paint-color ${color === c ? "is-active" : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={340}
        className="paint-canvas"
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />
    </div>
  );
}

/* ---- RETRO RECYCLE BIN ---- */
function RetroRecycleBin() {
  return (
    <div className="retro-app recycle-bin">
      <div className="rb-icon">🗑️</div>
      <div className="rb-empty">The Recycle Bin is empty.</div>
      <div className="rb-hint">Deleted files and folders will appear here.</div>
    </div>
  );
}

function RetroDesktop({ projects }: { projects: Project[] }) {
  const [bootState, setBootState] = useState<"off" | "bios" | "loading" | "desktop" | "shutting-down">("off");
  const [biosText, setBiosText] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [wins, setWins] = useState<WinState[]>([]);
  const [zTop, setZTop] = useState(10);
  const [drag, setDrag] = useState<{ id: number; dx: number; dy: number } | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [fullscreenWinId, setFullscreenWinId] = useState<number | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<string, { top: number; left: number }>>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = localStorage.getItem("wave-icon-positions");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });
  const [iconDrag, setIconDrag] = useState<{ key: string; dx: number; dy: number; moved: boolean } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const iconDragRef = useRef<{ key: string; dx: number; dy: number; startX: number; startY: number } | null>(null);
  const iconPositionsRef = useRef<Record<string, { top: number; left: number }>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioMasterRef = useRef<GainNode | null>(null);
  const fanNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; noise: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const soundOnRef = useRef(false);
  const justDraggedRef = useRef(false);
  const iconStartPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    iconPositionsRef.current = iconPositions;
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem("wave-icon-positions", JSON.stringify(iconPositions));
      } catch {}
    }
  }, [iconPositions]);

  const initAudio = useCallback(async () => {
    if (audioCtxRef.current) return;
    const Ctor = (window.AudioContext || (window as any).webkitAudioContext);
    if (!Ctor) return;
    const ctx = new Ctor();
    audioCtxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    audioMasterRef.current = master;

    // 风扇嗡嗡声:低频正弦 + 滤波噪声
    const osc1 = ctx.createOscillator();
    osc1.type = "sine"; osc1.frequency.value = 55;
    const osc2 = ctx.createOscillator();
    osc2.type = "sine"; osc2.frequency.value = 110;
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf; noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass"; noiseFilter.frequency.value = 180;
    const fanGain = ctx.createGain();
    fanGain.gain.value = 0.06;
    osc1.connect(fanGain); osc2.connect(fanGain);
    noise.connect(noiseFilter); noiseFilter.connect(fanGain);
    fanGain.connect(master);
    fanNodesRef.current = { osc1, osc2, noise, gain: fanGain };

    try { await ctx.resume(); } catch {}
    osc1.start(); osc2.start(); noise.start();
  }, []);

  const toggleSound = useCallback(async () => {
    if (!audioCtxRef.current) await initAudio();
    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;
    if (!ctx || !master) return;
    const next = !soundOnRef.current;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(next ? 0.55 : 0, ctx.currentTime + 0.4);
    soundOnRef.current = next;
    setSoundOn(next);
  }, [initAudio]);

  const playHddClick = useCallback(() => {
    if (!soundOnRef.current) return;
    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;
    if (!ctx || !master) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass"; filter.frequency.value = 2500; filter.Q.value = 4;
    const g = ctx.createGain();
    g.gain.value = 0.12;
    src.connect(filter); filter.connect(g); g.connect(master);
    src.start();
  }, []);

  const playWin95Startup = useCallback(() => {
    if (!soundOnRef.current) return;
    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    // 模仿 Brian Eno 的 Win95 开机音效 - 升调和弦 + 氛围
    const notes = [
      { f: 146.83, t: 0,    dur: 4.5, gain: 0.08 },
      { f: 220.00, t: 0.4,  dur: 4.0, gain: 0.06 },
      { f: 293.66, t: 0.9,  dur: 3.5, gain: 0.05 },
      { f: 369.99, t: 1.4,  dur: 3.0, gain: 0.05 },
      { f: 587.33, t: 2.2,  dur: 2.3, gain: 0.045 },
      { f: 739.99, t: 2.8,  dur: 1.8, gain: 0.04 },
    ];
    notes.forEach(({ f, t, dur, gain }) => {
      const osc = ctx.createOscillator();
      osc.type = "sine"; osc.frequency.value = f;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle"; osc2.frequency.value = f * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + t);
      g.gain.linearRampToValueAtTime(gain, now + t + 0.4);
      g.gain.linearRampToValueAtTime(0, now + t + dur);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0, now + t);
      g2.gain.linearRampToValueAtTime(gain * 0.3, now + t + 0.4);
      g2.gain.linearRampToValueAtTime(0, now + t + dur);
      osc.connect(g); osc2.connect(g2);
      g.connect(master); g2.connect(master);
      osc.start(now + t); osc2.start(now + t);
      osc.stop(now + t + dur + 0.1); osc2.stop(now + t + dur + 0.1);
    });
  }, []);

  useEffect(() => {
    return () => {
      try {
        fanNodesRef.current?.osc1.stop();
        fanNodesRef.current?.osc2.stop();
        fanNodesRef.current?.noise.stop();
      } catch {}
      audioCtxRef.current?.close();
    };
  }, []);

  const playClick = useCallback(() => {
    if (!soundOnRef.current) return;
    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    // 真实鼠标点击声 - 主要是短促的宽带噪声 + 塑料壳共振
    // 1. 主体: 极短宽带噪声脉冲，模拟塑料按键物理接触的"嗒"
    const dur = 0.012;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      // 极快指数衰减 + 轻微起音
      const t = i / d.length;
      const env = Math.exp(-t * 14) * (1 - Math.exp(-t * 40));
      d[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    // 低通滤掉太刺耳的高频，保留"实体感"
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 4500;
    lp.Q.value = 0.7;
    const ng = ctx.createGain();
    ng.gain.value = 0.25;
    noise.connect(lp); lp.connect(ng); ng.connect(master);
    noise.start(now);
    // 2. 塑料壳共振 - 一个很短的低中频脉冲，给噪声一点"体"
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.01);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.15, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
    osc.connect(og); og.connect(master);
    osc.start(now); osc.stop(now + 0.015);
  }, []);

  const startBoot = useCallback(async () => {
    // 初始化音频(用户点击触发,满足浏览器自动播放策略)
    if (!audioCtxRef.current) await initAudio();
    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.4);
    }
    soundOnRef.current = true;
    setSoundOn(true);

    setBootState("bios");
    setBiosText([]);
    const biosLines = [
      "YafeiOS BIOS v2.14.1228 (C) 1998-2025",
      "CPU: Creative-Processor 686 @ 233MHz",
      "Memory Test: 65536K OK",
      "Detecting IDE drives ...",
      "  Primary Master: VINTAGE-4GB",
      "  Secondary Master: CD-ROM 52X",
      "PCI device listing...",
      "  IRQ 11 - Video Card: S3 Trio64 4MB",
      "  IRQ 5  - Sound Card: Sound Blaster 16",
      "Booting from C: ...",
      "Loading YafeiOS...",
    ];

    let i = 0;
    const appendLine = () => {
      if (i >= biosLines.length) {
        setTimeout(() => setBootState("loading"), 400);
        return;
      }
      setBiosText((prev) => [...prev, biosLines[i]]);
      playHddClick();
      i++;
      setTimeout(appendLine, 180);
    };
    appendLine();
  }, [initAudio, playHddClick]);

  useEffect(() => {
    if (bootState !== "loading") return;
    const duration = 3800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setLoadingProgress(progress);
      if (progress < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setBootState("desktop"), 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bootState]);

  useEffect(() => {
    if (bootState === "desktop") {
      playWin95Startup();
      // 进入桌面后,只淡出风扇声,保留点击音效
      const ctx = audioCtxRef.current;
      const fanGain = fanNodesRef.current?.gain;
      if (ctx && fanGain) {
        fanGain.gain.cancelScheduledValues(ctx.currentTime);
        fanGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      }
    }
  }, [bootState, playWin95Startup]);

  const openWindow = useCallback((project: Project) => {
    setWins((prev) => {
      if (prev.some((w) => w.projectId === project.id)) {
        return prev.map((w) =>
          w.projectId === project.id ? { ...w, minimized: false, z: zTop + 1 } : w
        );
      }
      const nz = zTop + 1;
      const x = 40 + (prev.length % 4) * 30;
      const y = 30 + (prev.length % 4) * 25;
      const isEmbed = !!(project as any).embed;
      const win: WinState = {
        id: Date.now(),
        projectId: project.id,
        title: `${project.title}.exe`,
        minimized: false,
        maximized: true,
        x: 0,
        y: 0,
        w: window.innerWidth,
        h: window.innerHeight - 80,
        z: nz,
        forceFullscreen: false,
      };
      return [...prev, win];
    });
  }, [zTop]);

  const openApp = useCallback((appType: AppType) => {
    const existing = wins.find((w) => w.appType === appType);
    if (existing) {
      setWins((prev) => prev.map((w) =>
        w.appType === appType ? { ...w, minimized: false, z: zTop + 1 } : w
      ));
      return;
    }
    const appDef = DESKTOP_APPS.find((a) => a.type === appType);
    const nz = zTop + 1;
    const appWinW = appType === "calculator" ? 240 : appType === "notepad" ? 440 : 380;
    const appWinH = appType === "calculator" ? 340 : appType === "notepad" ? 360 : 320;
    const appWinX = 60 + (wins.length % 4) * 30;
    const appWinY = 40 + (wins.length % 4) * 25;
    const win: WinState = {
      id: Date.now(),
      appType,
      title: appDef ? `${appDef.title}.exe` : "App.exe",
      minimized: false,
      maximized: false,
      x: appWinX,
      y: appWinY,
      w: appWinW,
      h: appWinH,
      z: nz,
    };
    setWins((prev) => [...prev, win]);
  }, [zTop, wins]);

  const getIconKey = (type: "project" | "app", id: number | string) => `${type}-${id}`;

  const getIconPosition = useCallback((key: string, defaultTop: number, defaultLeft: number) => {
    return iconPositions[key] ?? { top: defaultTop, left: defaultLeft };
  }, [iconPositions]);

  const onIconDragStart = useCallback((key: string, e: React.PointerEvent<HTMLDivElement>) => {
    const iconEl = (e.target as HTMLElement).closest(".retro-folder, .retro-desktop-app") as HTMLElement | null;
    if (!iconEl) return;
    const rect = iconEl.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    iconDragRef.current = { key, dx, dy, startX: e.clientX, startY: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.stopPropagation();
    setIconDrag({ key, dx, dy, moved: false });
  }, []);

  const onIconDragMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = iconDragRef.current;
    if (!drag) return;
    const d = desktopRef.current?.getBoundingClientRect();
    if (!d) return;

    const moveDist = Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY);
    if (moveDist < 4) return;

    const iconW = 80;
    const iconH = 90;
    let left = e.clientX - d.left - drag.dx;
    let top = e.clientY - d.top - drag.dy;
    left = Math.max(0, Math.min(d.width - iconW, left));
    top = Math.max(0, Math.min(d.height - iconH - 36, top));

    setIconDrag((prev) => (prev && !prev.moved ? { ...prev, moved: true } : prev));

    setIconPositions((prev) => ({ ...prev, [drag.key]: { top, left } }));
  }, []);

  const onIconDragEnd = useCallback(() => {
    iconDragRef.current = null;
    setIconDrag(null);
  }, []);

  const closeWindow = useCallback((id: number) => {
    setWins((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: number) => {
    setWins((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const maximizeWindow = useCallback((id: number) => {
    setWins((prev) => prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const focusWindow = useCallback((id: number) => {
    setWins((prev) => {
      const w = prev.find((x) => x.id === id);
      if (!w) return prev;
      const nz = zTop + 1;
      setZTop(nz);
      return prev.map((x) => (x.id === id ? { ...x, z: nz, minimized: false } : x));
    });
  }, [zTop]);

  const onDragStart = useCallback(
    (id: number, e: React.PointerEvent<HTMLDivElement>) => {
      const win = wins.find((w) => w.id === id);
      if (!win || win.maximized) return;
      const nx = (e.target as HTMLElement).closest(".retro-window")?.getBoundingClientRect();
      const dx = nx ? e.clientX - nx.left : 0;
      const dy = nx ? e.clientY - nx.top : 0;
      setDrag({ id, dx, dy });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      focusWindow(id);
    },
    [wins, focusWindow]
  );

  const onDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag) return;
      const d = desktopRef.current?.getBoundingClientRect();
      if (!d) return;
      const x = Math.max(0, Math.min(d.width - 200, e.clientX - d.left - drag.dx));
      const y = Math.max(0, Math.min(d.height - 40, e.clientY - d.top - drag.dy));
      setWins((prev) => prev.map((w) => (w.id === drag.id ? { ...w, x, y } : w)));
    },
    [drag]
  );

  const onDragEnd = useCallback(() => {
    setDrag(null);
  }, []);

  const playShutdownSound = useCallback(() => {
    if (!soundOnRef.current) return;
    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    // 关机音效 - 降调和弦 + 电源衰减声
    const notes = [
      { f: 587.33, t: 0,    dur: 1.2, gain: 0.05 },
      { f: 440.00, t: 0.3,  dur: 1.2, gain: 0.045 },
      { f: 293.66, t: 0.6,  dur: 1.5, gain: 0.04 },
      { f: 146.83, t: 0.9,  dur: 2.0, gain: 0.035 },
    ];
    notes.forEach(({ f, t, dur, gain }) => {
      const osc = ctx.createOscillator();
      osc.type = "sine"; osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + t);
      g.gain.linearRampToValueAtTime(gain, now + t + 0.2);
      g.gain.linearRampToValueAtTime(0, now + t + dur);
      osc.connect(g); g.connect(master);
      osc.start(now + t); osc.stop(now + t + dur + 0.1);
    });
    // 电源关闭的嗡嗡声降频
    const fanGain = fanNodesRef.current?.gain;
    if (fanGain) {
      fanGain.gain.cancelScheduledValues(now);
      fanGain.gain.setValueAtTime(fanGain.gain.value, now);
      fanGain.gain.linearRampToValueAtTime(0, now + 1.5);
    }
  }, []);

  const shutDown = useCallback(() => {
    playClick();
    playShutdownSound();
    setBootState("shutting-down");
    // 关机动画后回到黑屏待机
    setTimeout(() => {
      setWins([]);
      setBiosText([]);
      setLoadingProgress(0);
      setBootState("off");
      soundOnRef.current = false;
      setSoundOn(false);
      const ctx = audioCtxRef.current;
      const master = audioMasterRef.current;
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      }
    }, 2800);
  }, [playClick, playShutdownSound]);

  return (
    <div className="retro-monitor-wrap">
      <div className="retro-monitor">
        <div className="retro-bezel">
          <div className={`retro-screen ${bootState === "off" ? "is-off" : ""}`} onClick={() => { if (soundOnRef.current) playClick(); }}>
            <div className="retro-crt-overlay" />
            <div className="retro-crt-flicker" />
            <AniCursor active={bootState === "desktop"} />

            {bootState === "off" && (
              <div className="retro-standby">
                <div className="retro-standby-waves" />
                <div className="retro-standby-waves wave2" />
                <motion.button
                  type="button"
                  className="retro-start-btn-screen"
                  onClick={startBoot}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="retro-start-power">⏻</span>
                  <span className="retro-start-text">Start Up</span>
                </motion.button>
                <div className="retro-standby-hint">Click to power on</div>
              </div>
            )}

            {bootState === "bios" && (
              <div className="retro-bios">
                {biosText.map((line, i) => (
                  <motion.div
                    key={i}
                    className="retro-bios-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.05 }}
                  >
                    {line}
                  </motion.div>
                ))}
                <span className="retro-bios-cursor">_</span>
              </div>
            )}

            {bootState === "loading" && (
              <div className="retro-win95-boot">
                <div className="retro-win95-logo">
                  <svg viewBox="0 0 120 90" width="120" height="90" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 Q30,8 55,18 L52,38 Q28,28 5,35 Z" fill="#ff5555"/>
                    <path d="M55,18 Q80,10 108,20 L105,42 Q80,32 52,38 Z" fill="#5ac85a"/>
                    <path d="M5,35 Q28,42 52,45 L48,72 Q28,68 5,62 Z" fill="#5588ff"/>
                    <path d="M52,45 Q80,42 105,48 L102,75 Q80,70 48,72 Z" fill="#ffd44a"/>
                  </svg>
                  <div className="retro-win95-text">
                    <span className="retro-win95-ms">Microsoft</span>
                    <span className="retro-win95-name">Windows<span className="retro-win95-95">95</span></span>
                  </div>
                </div>

                <div className="retro-win95-progress">
                  <div className="retro-win95-bar">
                    <div className="retro-win95-fill" style={{ width: `${loadingProgress}%` }} />
                  </div>
                  <div className="retro-win95-status">
                    {loadingProgress < 100 ? "Starting Windows 95..." : "Welcome."}
                  </div>
                </div>
              </div>
            )}

            {bootState === "desktop" && (
              <div className="retro-desktop" ref={desktopRef} onClick={() => setSelectedFolder(null)}>
                <div className="retro-desktop-icons">
                  {projects.map((p, i) => {
                    const key = getIconKey("project", p.id);
                    const defaultTop = 20 + (i % 4) * 90;
                    const defaultLeft = 20 + Math.floor(i / 4) * 100;
                    const pos = getIconPosition(key, defaultTop, defaultLeft);
                    const isSelected = String(selectedFolder) === String(p.id);
                    const isDragging = iconDrag?.key === key && iconDrag.moved;
                    return (
                      <div
                        key={`proj-${p.id}`}
                        className={`retro-folder ${isSelected ? "is-selected" : ""} ${isDragging ? "is-dragging" : ""}`}
                        style={{ top: pos.top, left: pos.left, cursor: "grab" }}
                        onPointerDown={(e) => onIconDragStart(key, e)}
                        onPointerMove={onIconDragMove}
                        onPointerUp={() => onIconDragEnd()}
                        onPointerCancel={() => onIconDragEnd()}
                        onClick={(e) => {
                          if (iconDrag?.moved) return;
                          e.stopPropagation();
                          setSelectedFolder(String(p.id));
                        }}
                        onDoubleClick={() => { playClick(); openWindow(p); }}
                        title={`Double-click to open ${p.title}`}
                      >
                        <div className="retro-folder-icon">
                          <div className="folder-paper" />
                          <div className="folder-tab" />
                          <div className="folder-body" />
                        </div>
                        <div className="retro-folder-label">{p.title}</div>
                      </div>
                    );
                  })}

                  {DESKTOP_APPS.map((app, i) => {
                    const key = getIconKey("app", app.type);
                    const offset = projects.length;
                    const defaultTop = 20 + ((i + offset) % 4) * 90;
                    const defaultLeft = 20 + Math.floor((i + offset) / 4) * 100;
                    const pos = getIconPosition(key, defaultTop, defaultLeft);
                    const isAppSelected = String(selectedFolder ?? "") === app.type;
                    const isDragging = iconDrag?.key === key && iconDrag.moved;
                    return (
                      <div
                        key={`app-${app.type}`}
                        className={`retro-desktop-app ${isAppSelected ? "is-selected" : ""} ${isDragging ? "is-dragging" : ""}`}
                        style={{ top: pos.top, left: pos.left, cursor: "grab" }}
                        onPointerDown={(e) => onIconDragStart(key, e)}
                        onPointerMove={onIconDragMove}
                        onPointerUp={() => onIconDragEnd()}
                        onPointerCancel={() => onIconDragEnd()}
                        onClick={(e) => {
                          if (iconDrag?.moved) return;
                          e.stopPropagation();
                          setSelectedFolder(app.type);
                        }}
                        onDoubleClick={() => { playClick(); openApp(app.type); }}
                        title={`Double-click to open ${app.title}`}
                      >
                        <div className="retro-app-icon">{app.icon}</div>
                        <div className="retro-app-label">{app.label}</div>
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {wins.map((w) => {
                    if (w.appType) {
                      const appDef = DESKTOP_APPS.find((a) => a.type === w.appType);
                      const renderApp = () => {
                        switch (w.appType) {
                          case "notepad": return <RetroNotepad />;
                          case "calculator": return <RetroCalculator />;
                          case "about": return <RetroAbout />;
                          case "mycomputer": return <RetroMyComputer />;
                          case "paint": return <RetroPaint />;
                          case "recyclebin": return <RetroRecycleBin />;
                          default: return <RetroNotepad />;
                        }
                      };
                      return (
                        <DesktopWindow
                          key={w.id}
                          win={w}
                          title={w.title}
                          icon={appDef?.icon}
                          onClose={() => closeWindow(w.id)}
                          onMinimize={() => minimizeWindow(w.id)}
                          onMaximize={() => maximizeWindow(w.id)}
                          onFocus={() => focusWindow(w.id)}
                          onDragStart={(e) => onDragStart(w.id, e)}
                          onDrag={onDrag}
                          onDragEnd={onDragEnd}
                        >
                          {renderApp()}
                        </DesktopWindow>
                      );
                    }
                    const project = projects.find((p) => p.id === w.projectId);
                    if (!project) return null;
                    return (
                      <DesktopWindow
                        key={w.id}
                        win={w}
                        title={w.title}
                        isFullscreen={fullscreenWinId === w.id}
                        isEmbed={!!(project as any).embed}
                        onClose={() => closeWindow(w.id)}
                        onMinimize={() => minimizeWindow(w.id)}
                        onMaximize={() => maximizeWindow(w.id)}
                        onFocus={() => focusWindow(w.id)}
                        onDragStart={(e) => onDragStart(w.id, e)}
                        onDrag={onDrag}
                        onDragEnd={onDragEnd}
                      >
                        <ProjectDetailView
                          project={project}
                          forceFullscreen={w.forceFullscreen}
                          onCloseWindow={() => closeWindow(w.id)}
                          onFullscreenChange={(fs) => setFullscreenWinId(fs ? w.id : null)}
                        />
                      </DesktopWindow>
                    );
                  })}
                </AnimatePresence>

                <div className="retro-taskbar">
                  <button type="button" className="retro-start-btn" onClick={shutDown}>
                    <span className="start-icon">⏻</span>
                    <span>ShutDown</span>
                  </button>
                  <div className="retro-taskbar-windows">
                    {wins.map((w) => {
                      const appDef = w.appType ? DESKTOP_APPS.find((a) => a.type === w.appType) : null;
                      const ic = appDef?.icon ?? "📁";
                      return (
                        <button
                          key={w.id}
                          type="button"
                          className={`retro-task-btn ${w.minimized ? "is-minimized" : ""}`}
                          onClick={() => {
                            if (w.minimized) focusWindow(w.id);
                            else minimizeWindow(w.id);
                          }}
                        >
                          <span className="tb-ic">{ic}</span>
                          <span className="tb-name">{w.title.replace(".exe", "")}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="retro-clock">
                    <span>📅</span>
                    <span>Aug 01 · 2025</span>
                  </div>
                </div>
              </div>
            )}

            {bootState === "shutting-down" && (
              <motion.div
                className="retro-shutdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="retro-shutdown-content"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 0.92, opacity: 0.6 }}
                  transition={{ duration: 2.5, ease: "easeIn" }}
                >
                  <div className="retro-shutdown-icon">⏻</div>
                  <div className="retro-shutdown-text">Shutting Down...</div>
                  <div className="retro-shutdown-bar">
                    <motion.div
                      className="retro-shutdown-fill"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "linear" }}
                    />
                  </div>
                  <div className="retro-shutdown-hint">It is now safe to turn off your computer.</div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="retro-monitor-foot">
          <div className="retro-monitor-brand">◇ YAFEI · CRT-1700</div>
        </div>
        <div className="retro-monitor-base" />
      </div>

      <div className="retro-hint">
        💡 <strong>Tip:</strong> Click a folder to select, <em>double-click</em> to open.
        Drag windows by the title bar. Use the taskbar to switch windows.
      </div>
    </div>
  );
}

const FISH_COLORS = [
  "#ff9f5a", "#ff758f", "#c77dff", "#72efdd",
  "#ffd670", "#ff8fa3", "#9b5de5", "#00bbf9",
  "#fb8500", "#f15bb5", "#00f5d4", "#fee440",
];
const FISH_SHAPES = ["fish-a", "fish-b", "fish-c", "fish-d"];
const DOLPHIN_COLORS = ["#a8d8ea", "#b8e0f6", "#9bc4e8", "#c5d8f0"];

function makeFishes() {
  const n = 18;
  const arr: {
    id: number; top: number; size: number; color: string; delay: number;
    duration: number; dir: 1 | -1; shape: string; bob: number;
  }[] = [];
  // 普通鱼群（已移除）
  // 海豚（已移除）
  return arr;
}

export default function WavePortfolioPage() {
  const waveRef = useRef<HTMLDivElement>(null!);
  const { isActive, toggle, dispose } = useAudioReactive({ targetRef: waveRef });
  const { displayed: greetingText, done: greetingDone } = useTypewriter(GREETING_TEXT, 0);
  const { displayed, done } = useTypewriter(SUBTITLE_TEXT, GREETING_TEXT.length * 55 + 500);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [fishes, setFishes] = useState<ReturnType<typeof makeFishes>>([]);

  useEffect(() => {
    setFishes(makeFishes());
    // 禁用浏览器滚动恢复，确保刷新后始终回到顶部
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const navBg = useTransform(scrollY, [0, 80], ["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"]);

  const layer1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const layer1Opacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);

  const layer2Scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.4]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const layer2Opacity = useTransform(scrollYProgress, [0, 1], [0.85, 0.15]);

  const layer3Scale = useTransform(scrollYProgress, [0, 1], [0.92, 0.85]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -380]);
  const layer3Opacity = useTransform(scrollYProgress, [0, 1], [0.65, 0.1]);

  const textY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const textScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.78]);

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0, 0.5]);

  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const heroH = window.innerHeight;
      const val = window.scrollY < heroH * 0.85;
      setInHero(val);
      if (!val && isActive) {
        toggle();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isActive, toggle]);

  useEffect(() => {
    return () => dispose();
  }, [dispose]);

  return (
    <div className="wave-portfolio">
      <motion.div className="wave-fixed-bg" style={{ scale: bgScale }} />

      <div className="wave-stars">
        <span className="wave-star-layer s1" />
        <span className="wave-star-layer s2" />
        <span className="wave-star-layer s3" />
      </div>
      <div className="wave-fishes" aria-hidden>
        {fishes.map((f) => (
          <span
            key={f.id}
            className={`wave-fish ${f.shape}`}
            style={{
              top: `${f.top}%`,
              width: `${f.size}px`,
              height: `${f.size * (f.shape === "dolphin" ? 0.42 : 0.55)}px`,
              color: f.color,
              animationDuration: `${f.duration}s, ${4 / f.bob}s`,
              animationDelay: `${f.delay}s, ${f.delay * 0.3}s`,
              transform: `scaleX(${f.dir})`,
            }}
          >
            <svg viewBox={f.shape === "dolphin" ? "0 0 100 42" : "0 0 100 55"} width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`fg${f.id}`} x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {f.shape === "fish-a" && (
                <g fill={`url(#fg${f.id})`}>
                  <ellipse cx="45" cy="28" rx="34" ry="18" />
                  <polygon points="79,28 98,10 98,46" />
                  <polygon points="20,16 25,5 32,18" />
                  <polygon points="20,40 25,50 32,38" />
                  <circle cx="62" cy="24" r="3.2" fill="#fff" />
                  <circle cx="62.5" cy="24.5" r="1.6" fill="#111" />
                </g>
              )}
              {f.shape === "fish-b" && (
                <g fill={`url(#fg${f.id})`}>
                  <path d="M18 28 Q35 10 62 18 Q80 22 82 28 Q80 34 62 40 Q35 48 18 28 Z" />
                  <polygon points="82,28 100,14 100,42" />
                  <path d="M30 28 Q32 14 38 12" stroke="currentColor" strokeWidth="2" fill="none" strokeOpacity="0.6" />
                  <path d="M30 28 Q32 42 38 44" stroke="currentColor" strokeWidth="2" fill="none" strokeOpacity="0.6" />
                  <circle cx="66" cy="26" r="2.6" fill="#fff" />
                  <circle cx="66.5" cy="26.5" r="1.3" fill="#111" />
                </g>
              )}
              {f.shape === "fish-c" && (
                <g fill={`url(#fg${f.id})`}>
                  <path d="M20 28 C25 12, 55 10, 70 22 C80 28, 78 36, 70 38 C55 50, 25 48, 20 28 Z" />
                  <path d="M70 30 L95 8 L95 48 Z" />
                  <path d="M32 28 Q38 18 42 22 Q46 28 42 34 Q38 38 32 28 Z" fill="currentColor" fillOpacity="0.4" />
                  <path d="M44 28 Q50 20 54 24 Q58 28 54 32 Q50 36 44 28 Z" fill="currentColor" fillOpacity="0.4" />
                  <circle cx="56" cy="25" r="2.8" fill="#fff" />
                  <circle cx="56.5" cy="25.5" r="1.4" fill="#111" />
                </g>
              )}
              {f.shape === "fish-d" && (
                <g fill={`url(#fg${f.id})`}>
                  <ellipse cx="40" cy="28" rx="28" ry="20" />
                  <polygon points="68,28 92,6 92,50" />
                  <polygon points="30,10 38,0 44,12" />
                  <polygon points="30,46 38,54 44,44" />
                  <line x1="20" y1="28" x2="52" y2="28" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.2" />
                  <line x1="22" y1="16" x2="48" y2="22" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
                  <line x1="22" y1="40" x2="48" y2="34" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
                  <circle cx="54" cy="24" r="3" fill="#fff" />
                  <circle cx="54.5" cy="24.5" r="1.5" fill="#111" />
                </g>
              )}
              {f.shape === "dolphin" && (
                <g fill={`url(#fg${f.id})`}>
                  {/* 身体：流线型 */}
                  <path d="M5 22 C10 14, 25 10, 45 12 C60 13, 72 16, 80 20 L88 18 L86 24 L90 26 L86 28 L88 34 L80 32 C72 36, 60 39, 45 38 C25 38, 10 34, 5 22 Z" />
                  {/* 背鳍 */}
                  <path d="M42 12 Q48 2, 54 4 L52 13 Z" />
                  {/* 胸鳍 */}
                  <path d="M48 30 Q52 38, 58 40 L54 31 Z" />
                  {/* 尾鳍 */}
                  <path d="M88 18 Q95 14, 98 8 L93 21 L98 34 Q95 30, 88 34 Z" />
                  {/* 腹部高光 */}
                  <path d="M20 28 Q40 33, 70 28 L70 30 Q40 35, 20 30 Z" fill="#fff" fillOpacity="0.25" />
                  {/* 眼睛 */}
                  <circle cx="72" cy="20" r="2.2" fill="#fff" />
                  <circle cx="72.5" cy="20.5" r="1.1" fill="#111" />
                  {/* 嘴 */}
                  <path d="M82 24 L88 23" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
                </g>
              )}
            </svg>
          </span>
        ))}
      </div>
      <motion.div
        className="wave-bg-overlay"
        style={{ opacity: overlayOpacity }}
      />

      <motion.nav
        className="wave-nav"
        style={{ backgroundColor: navBg }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="wave-nav-left">
          <a href="#home" className="wave-nav-logo">
          <span className="wave-logo-dot" />
          <span className="wave-logo-text">Yafei</span>
        </a>
        <button
          type="button"
          onClick={toggle}
          className={`wave-nav-sound-btn outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 ${isActive ? "active" : ""}`}
          aria-label={isActive ? "Mute sound" : "Enable sound"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        </div>
        <div className="wave-nav-links">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="wave-nav-link">
              {item.label}
            </a>
          ))}
        </div>
      </motion.nav>

      <section id="home" ref={heroRef} className="wave-hero">

        <motion.div
          ref={waveRef}
          className="wave-hero-wave-bg"
          style={{ pointerEvents: inHero ? "auto" : "none", scale: heroScale }}
        >
          <WaveScene audioTargetRef={waveRef} />
        </motion.div>

        <motion.div
          className="wave-hero-overlay"
          style={{ scale: textScale, opacity: textOpacity }}
        >
          <motion.div
            className="wave-hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="wave-hero-greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="tw-text">{greetingText}</span>
              {!greetingDone && <span className="tw-cursor">|</span>}
            </motion.h1>

            <motion.p
              className="wave-hero-typewriter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <span className="tw-text">{displayed}</span>
              <span className={`tw-cursor ${done ? "blink" : ""}`}>|</span>
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
</section>

      <section id="about" className="wave-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="wave-about-title">About Me</h2>

          <motion.div
            className="wave-about-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <IDBadge />
            <div className="wave-about-text">
              <img
                src="/images/b1d48af5337f638db8a75199e6f716de.png"
                alt="About Yafei"
                className="about-image"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="projects" className="wave-section wave-projects-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="wave-projects-title">Projects</h2>
          <p className="wave-projects-subtitle">
            Double-click the folders on the vintage desktop below to view each project.
          </p>

          <RetroDesktop projects={projects} />
        </motion.div>
      </section>

      <section id="resume" className="wave-section wave-resume-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="wave-resume-title">Get in Touch</h2>
          <p className="wave-resume-desc">
            I&apos;m always interested in thoughtful collaborations — product design,
            brand identity, illustration commissions, or just a good conversation
            about design.
          </p>
          <div className="wave-resume-links">
            <button
              type="button"
              className={`wave-resume-link${copiedId === "email" ? " copied" : ""}`}
              onClick={() => copyToClipboard("2947466559@qq.com", "email")}
            >
              <span>Email</span>
              <span className="wave-link-value">2947466559@qq.com</span>
              <span className="wave-link-arrow">
                {copiedId === "email" ? "✓" : "→"}
              </span>
            </button>
            <button
              type="button"
              className={`wave-resume-link${copiedId === "phone" ? " copied" : ""}`}
              onClick={() => copyToClipboard("+86 18703677373", "phone")}
            >
              <span>Phone</span>
              <span className="wave-link-value">+86 18703677373</span>
              <span className="wave-link-arrow">
                {copiedId === "phone" ? "✓" : "→"}
              </span>
            </button>
            <button
              type="button"
              className="wave-resume-link"
              onClick={() => setShowQr(true)}
            >
              <span>WeChat</span>
              <span className="wave-link-value">hqa0806_</span>
              <span className="wave-link-arrow">→</span>
            </button>
          </div>
          <div className="wave-footer">
            <p>© 2026 Yafei. Crafted with care.</p>
            <p className="wave-footer-available">
              <span className="wave-dot" />
              Available for new work
            </p>
          </div>
        </motion.div>
      </section>

      {showQr && (
        <motion.div
          className="wave-qr-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQr(false)}
        >
          <motion.div
            className="wave-qr-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="wave-qr-close"
              onClick={() => setShowQr(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src="/images/wechat-qr.png"
              alt="WeChat QR code"
              className="wave-qr-image"
            />
            <p className="wave-qr-hint">扫码添加微信</p>
          </motion.div>
        </motion.div>
      )}

      {/* 隐藏预加载 iframe —— 预热 Figma 原型，加速点单交互 */}
      <iframe
        src="https://embed.figma.com/proto/fuwUuSdyfemaX4QBdYjHS1/Untitled?page-id=0%3A1&starting-point-node-id=62%3A92&embed-host=share"
        style={{ position: "fixed", top: "-1px", left: "-1px", width: "1px", height: "1px", opacity: 0.01, pointerEvents: "none" }}
        title="prewarm-figma"
        aria-hidden={true}
      />
    </div>
  );
}
