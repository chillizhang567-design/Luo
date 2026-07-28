"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

declare global {
  interface Window {
    THREE: typeof import("three");
  }
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;

  varying float vElevation;
  varying vec2 vUv;
  varying float vMouseInfluence;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;

    float x = position.x;
    float y = position.y;
    float t = uTime * 0.15;

    float wave1 = sin(x * 1.2 + t * 2.0) * 0.15;
    float wave2 = cos(y * 0.9 + t * 1.3) * 0.12;
    float wave3 = sin((x + y) * 0.8 + t * 1.7) * 0.10;

    float n1 = snoise(vec3(x * 0.6, y * 0.6, t)) * 0.25;
    float n2 = snoise(vec3(x * 1.2 + 5.0, y * 1.2, t * 0.7)) * 0.15;

    float elevation = wave1 + wave2 + wave3 + n1 + n2;

    float distX = x - uMouse.x;
    float distY = y - uMouse.y;
    float dist = sqrt(distX * distX + distY * distY);
    float mouseRadius = 3.0;
    float mouseFalloff = smoothstep(mouseRadius, 0.0, dist);
    float mouseWave = mouseFalloff * uMouseStrength * sin(dist * 4.0 - uTime * 3.0) * 0.5;

    elevation += mouseWave;
    vElevation = elevation;
    vMouseInfluence = mouseFalloff * uMouseStrength;

    vec3 pos = position;
    pos.z += elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;

  varying float vElevation;
  varying vec2 vUv;
  varying float vMouseInfluence;

  vec3 palette(float t) {
    vec3 a = vec3(0.08, 0.12, 0.35);
    vec3 b = vec3(0.45, 0.25, 0.65);
    vec3 c = vec3(0.85, 0.35, 0.65);
    vec3 d = vec3(0.95, 0.55, 0.75);

    float s1 = smoothstep(0.0, 0.4, t);
    float s2 = smoothstep(0.3, 0.7, t);
    float s3 = smoothstep(0.6, 1.0, t);

    vec3 col = mix(a, b, s1);
    col = mix(col, c, s2);
    col = mix(col, d, s3);
    return col;
  }

  void main() {
    float t = uTime * 0.3;

    float flowX = vUv.x * 6.0 + t;
    float flowY = vUv.y * 4.0 - t * 0.7;

    float stripes1 = sin(flowX + vElevation * 3.0) * 0.5 + 0.5;
    float stripes2 = sin(flowY * 1.3 + vElevation * 2.0 + t * 0.5) * 0.5 + 0.5;
    float stripes3 = sin((flowX + flowY) * 0.7 + vElevation * 4.0 - t * 0.3) * 0.5 + 0.5;

    float stripeMix = stripes1 * 0.4 + stripes2 * 0.35 + stripes3 * 0.25;

    float elevNorm = smoothstep(-0.5, 0.8, vElevation);

    vec3 baseColor = palette(elevNorm);

    vec3 stripeColor1 = vec3(0.95, 0.75, 0.95);
    vec3 stripeColor2 = vec3(0.65, 0.55, 0.95);
    vec3 stripeColor3 = vec3(0.85, 0.45, 0.75);

    float stripeIntensity = pow(stripeMix, 2.5);
    vec3 stripeColor = mix(stripeColor1, stripeColor2, stripes2);
    stripeColor = mix(stripeColor, stripeColor3, stripes3);

    vec3 color = mix(baseColor, stripeColor, stripeIntensity * 0.5);

    float mouseGlow = vMouseInfluence * 0.3;
    vec3 glowColor = vec3(1.0, 0.6, 0.9);
    color += glowColor * mouseGlow;

    float highlight = pow(max(0.0, vElevation + 0.3), 2.0) * 0.4;
    color += vec3(highlight * 0.8, highlight * 0.4, highlight * 1.2);

    float distFromCenter = length(vUv - 0.5) * 1.4;
    float vignette = 1.0 - smoothstep(0.6, 1.2, distFromCenter);
    color *= vignette * 0.5 + 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface WaveSceneProps {
  className?: string;
  audioTargetRef?: RefObject<HTMLDivElement>;
}

export default function WaveScene({ className, audioTargetRef }: WaveSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (audioTargetRef) {
      audioTargetRef.current = el;
    }
  }, [audioTargetRef]);
  const [threeReady, setThreeReady] = useState(false);

  useEffect(() => {
    if (window.THREE) {
      setThreeReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    script.async = true;
    script.onload = () => setThreeReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!threeReady || !window.THREE) return;

    const container = containerRef.current;
    if (!container) return;

    const THREE = window.THREE;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a1a, 1);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(10, 7, 256, 256);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.35;
    scene.add(mesh);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    let mouseStrength = 0;
    let targetMouseStrength = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouse.set(x * 4, y * 3);
      targetMouseStrength = 1.0;
    };

    const handleMouseLeave = () => {
      targetMouse.set(0, 0);
      targetMouseStrength = 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        targetMouse.set(x * 4, y * 3);
        targetMouseStrength = 1.0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        targetMouse.set(x * 4, y * 3);
        targetMouseStrength = 1.0;
      }
    };

    const handleTouchEnd = () => {
      targetMouse.set(0, 0);
      targetMouseStrength = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      mouse.lerp(targetMouse, 0.08);
      mouseStrength += (targetMouseStrength - mouseStrength) * 0.1;
      uniforms.uMouse.value.copy(mouse);
      uniforms.uMouseStrength.value = mouseStrength;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [threeReady]);

  return (
    <div
      ref={setRefs}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
}