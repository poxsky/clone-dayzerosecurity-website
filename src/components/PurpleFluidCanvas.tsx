"use client";

import React, { useEffect, useRef } from "react";

interface ParticleSplat {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: number; // 280 - 295 (electric purple / violet)
  decay: number;
}

/*
 * Ambient hero background — tuned to stay *barely there*:
 * low-alpha, large, slow washes instead of bright plumes.
 */
const SPLAT_ALPHA_BASE = 0.1;
const MAX_SPLATS = 36;
const AMBIENT_INTERVAL_MS = 5200;
const DPR_CAP = 1.5;

export default function PurpleFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let ambientTimer: ReturnType<typeof setInterval> | undefined;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

    const splats: ParticleSplat[] = [];

    const addSplat = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      radiusScale = 1
    ) => {
      const count = 2;
      for (let i = 0; i < count; i++) {
        splats.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          vx: vx * (0.25 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.8,
          vy: vy * (0.25 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.8,
          radius: (120 + Math.random() * 160) * radiusScale,
          alpha: SPLAT_ALPHA_BASE + Math.random() * 0.08,
          hue: 282 + Math.random() * 16,
          decay: 0.006 + Math.random() * 0.006,
        });
      }
      if (splats.length > MAX_SPLATS) {
        splats.splice(0, splats.length - MAX_SPLATS);
      }
    };

    const paintSplat = (s: ParticleSplat) => {
      const grad = ctx.createRadialGradient(
        s.x,
        s.y,
        s.radius * 0.05,
        s.x,
        s.y,
        s.radius
      );
      grad.addColorStop(0, `hsla(${s.hue}, 95%, 62%, ${s.alpha})`);
      grad.addColorStop(0.45, `hsla(${s.hue - 6}, 90%, 44%, ${s.alpha * 0.5})`);
      grad.addColorStop(1, `hsla(${s.hue - 12}, 85%, 18%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const seedAmbient = (n: number, scale: number) => {
      for (let i = 0; i < n; i++) {
        addSplat(
          width * (0.25 + Math.random() * 0.5),
          height * (0.25 + Math.random() * 0.5),
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          scale
        );
      }
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      // Static, gentle wash — no animation loop, no listeners.
      seedAmbient(6, 1.4);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";
      for (const s of splats) paintSplat(s);
      ctx.globalCompositeOperation = "source-over";
      return;
    }

    let lastMouseX = width / 2;
    let lastMouseY = height / 2;
    let lastSplatX = -1e9;
    let lastSplatY = -1e9;

    const pointerSplat = (x: number, y: number) => {
      // only react to deliberate movement, not every pixel
      const dx = x - lastSplatX;
      const dy = y - lastSplatY;
      if (dx * dx + dy * dy < 22 * 22) return;
      const vx = (x - lastMouseX) * 0.16;
      const vy = (y - lastMouseY) * 0.16;
      lastMouseX = x;
      lastMouseY = y;
      lastSplatX = x;
      lastSplatY = y;
      addSplat(x, y, vx, vy, 0.75);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerSplat(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        pointerSplat(touch.clientX - rect.left, touch.clientY - rect.top);
      }
    };

    const handleResize = () => resize();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    seedAmbient(6, 1.3);

    ambientTimer = setInterval(() => {
      addSplat(
        width * (0.15 + Math.random() * 0.7),
        height * (0.2 + Math.random() * 0.6),
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        1.35
      );
    }, AMBIENT_INTERVAL_MS);

    const render = () => {
      // soft dark fade trail for fluid dissipation feel
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";

      for (let i = splats.length - 1; i >= 0; i--) {
        const s = splats[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.965; // velocity dissipation
        s.vy *= 0.965;
        s.radius *= 1.003; // slow dye dispersion
        s.alpha -= s.decay;

        if (s.alpha <= 0.008) {
          splats.splice(i, 1);
          continue;
        }

        paintSplat(s);
      }

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (ambientTimer) clearInterval(ambientTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black"
    />
  );
}
