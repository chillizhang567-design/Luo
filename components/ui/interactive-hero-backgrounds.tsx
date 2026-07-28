"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  Color,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
} from "three";
import { cn } from "@/lib/utils";

const MailIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ArrowRightIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const MenuIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const SunIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

class X {
  #config: any;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId: number = 0;
  #clock: Clock = new Clock();
  #animationState = { elapsed: 0, delta: 0 };
  #isAnimating: boolean = false;
  #isVisible: boolean = false;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  size: any = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  onBeforeRender: (state: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: any) => void = () => {};

  constructor(config: any) {
    this.#config = config;
    this.canvas = this.#config.canvas;
    this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      alpha: true,
      antialias: true,
      ...this.#config.rendererOptions,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.canvas.style.display = "block";
    this.#initObservers();
    this.resize();
  }

  #initObservers() {
    const parentEl =
      this.#config.size === "parent" ? (this.canvas.parentNode as Element) : null;
    if (parentEl) {
      this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
      this.#resizeObserver.observe(parentEl);
    } else {
      window.addEventListener("resize", this.#onResize.bind(this));
    }
    this.#intersectionObserver = new IntersectionObserver(
      this.#onIntersection.bind(this),
      { threshold: 0 }
    );
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
  }

  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    const parentEl =
      this.#config.size === "parent"
        ? (this.canvas.parentNode as HTMLElement)
        : null;
    const w = parentEl ? parentEl.offsetWidth : window.innerWidth;
    const h = parentEl ? parentEl.offsetHeight : window.innerHeight;
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.camera.aspect = this.size.ratio;
    this.camera.updateProjectionMatrix();
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight =
      2 * Math.tan(fovRad / 2) * this.camera.position.z;
    this.size.wWidth = this.size.wHeight * this.camera.aspect;
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.onAfterResize(this.size);
  }

  #onIntersection(e: any) {
    this.#isAnimating = e[0].isIntersecting;
    this.#isAnimating ? this.#startAnimation() : this.#stopAnimation();
  }

  #onVisibilityChange() {
    if (this.#isAnimating) {
      document.hidden ? this.#stopAnimation() : this.#startAnimation();
    }
  }

  #startAnimation() {
    if (this.#isVisible) return;
    this.#isVisible = true;
    this.#clock.start();
    const f = () => {
      this.#animationFrameId = requestAnimationFrame(f);
      this.#animationState.delta = this.#clock.getDelta();
      this.#animationState.elapsed += this.#animationState.delta;
      this.onBeforeRender(this.#animationState);
      this.renderer.render(this.scene, this.camera);
    };
    f();
  }

  #stopAnimation() {
    if (this.#isVisible) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isVisible = false;
      this.#clock.stop();
    }
  }

  dispose() {
    this.#stopAnimation();
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    window.removeEventListener("resize", this.#onResize.bind(this));
    document.removeEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
    this.scene.clear();
    this.renderer.dispose();
  }
}

interface InteractiveHeroBackgroundsProps {
  className?: string;
  children?: React.ReactNode;
}

export function InteractiveHeroBackgrounds({
  className,
  children,
}: InteractiveHeroBackgroundsProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const three = new X({
      canvas,
      size: "parent",
      rendererOptions: {
        powerPreference: "high-performance",
      },
    });

    three.renderer.toneMapping = ACESFilmicToneMapping;
    three.renderer.toneMappingEx = 1.2;

    const ambientLight = new AmbientLight(0xffffff, 0.4);
    three.scene.add(ambientLight);

    const pointLight1 = new PointLight(0xffaa66, 80, 20, 1.5);
    pointLight1.position.set(5, 5, 5);
    three.scene.add(pointLight1);

    const pointLight2 = new PointLight(0x6688ff, 40, 20, 1.5);
    pointLight2.position.set(-5, -3, 3);
    three.scene.add(pointLight2);

    const sphereCount = 80;
    const sphereGeometry = new SphereGeometry(0.5, 64, 64);

    const sphereMaterial = new MeshPhysicalMaterial({
      color: new Color(isDark ? 0x1a1a2e : 0xffffff),
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.3,
      thickness: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
    });

    const instancedMesh = new InstancedMesh(
      sphereGeometry,
      sphereMaterial,
      sphereCount
    );
    instancedMesh.instanceMatrix.setUsage(4);
    three.scene.add(instancedMesh);

    const dummy = new Vector3();
    const basePositions: Vector3[] = [];

    for (let i = 0; i < sphereCount; i++) {
      const x = MathUtils.randFloatSpread(10);
      const y = MathUtils.randFloatSpread(6);
      const z = MathUtils.randFloatSpread(5);
      dummy.set(x, y, z);
      basePositions.push(dummy.clone());
      dummy.toArray(instancedMesh.matrix, i * 16);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;

    const raycaster = new Raycaster();
    const pointer = new Vector2(-10, -10);
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const intersectPoint = new Vector3();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, three.camera);
      raycaster.ray.intersectPlane(plane, intersectPoint);
    };

    const handlePointerLeave = () => {
      pointer.set(-10, -10);
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    three.onBeforeRender = ({ elapsed }: { elapsed: number }) => {
      for (let i = 0; i < sphereCount; i++) {
        const base = basePositions[i];
        const offsetY = Math.sin(elapsed + base.x) * 0.3;
        const offsetX = Math.cos(elapsed * 0.5 + base.y) * 0.2;

        dummy.set(
          base.x + offsetX,
          base.y + offsetY,
          base.z + Math.sin(elapsed * 0.7 + base.z) * 0.15
        );

        const distToPointer = dummy.distanceTo(intersectPoint);
        const repulsion = Math.max(0, 1 - distToPointer / 2.5) * 0.5;
        dummy.x += (dummy.x - intersectPoint.x) * repulsion * 0.3;
        dummy.y += (dummy.y - intersectPoint.y) * repulsion * 0.3;

        dummy.toArray(instancedMesh.matrix, i * 16);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
    };

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      three.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [isDark]);

  const navItems = useMemo(
    () => [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Resume", href: "#resume" },
    ],
    []
  );

  return (
    <section
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-midnight",
        className
      )}
    >
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 50% 50%, #1a1a3e 0%, #0a0a1a 70%, #000000 100%)"
            : "radial-gradient(ellipse at 50% 50%, #2a2a4e 0%, #1a1a2a 70%, #0a0a0a 100%)",
        }}
      />

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-midnight to-transparent" />
      </div>

      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-moon shadow-[0_0_12px_rgba(255,240,189,0.8)]" />
          <span className="font-serif text-sm tracking-widest text-moon uppercase">
            Yafei
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-white/70 hover:text-white transition-colors duration-300 font-serif tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 text-white/70 hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 text-white/70 hover:text-white"
            aria-label="Toggle menu"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <nav className="absolute top-16 left-0 right-0 z-30 md:hidden bg-midnight/95 backdrop-blur-md border-t border-white/10">
          <div className="flex flex-col py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200 font-serif tracking-wide"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-moon via-ember to-moon bg-clip-text text-transparent">
              Yafei
            </span>
          </h1>
          <p className="font-serif text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Welcome to my creative space where code meets design, and ideas
            become interactive experiences.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-ember to-moon text-midnight font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,173,104,0.4)]"
            >
              <MailIcon size={18} />
              <span>Get in Touch</span>
              <ArrowRightIcon
                size={16}
              />
            </a>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 font-medium"
            >
              View Work
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/40 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      {children}
    </section>
  );
}