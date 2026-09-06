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

export default function PurpleFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const splats: ParticleSplat[] = [];

    const addSplat = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      radiusScale = 1
    ) => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        splats.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          vx: vx * (0.4 + Math.random() * 0.8) + (Math.random() - 0.5) * 1.5,
          vy: vy * (0.4 + Math.random() * 0.8) + (Math.random() - 0.5) * 1.5,
          radius: (90 + Math.random() * 140) * radiusScale,
          alpha: 0.35 + Math.random() * 0.25,
          hue: 282 + Math.random() * 16, // Electric purple #DE5CFF to #C000F0
          decay: 0.003 + Math.random() * 0.004,
        });
      }
      if (splats.length > 85) {
        splats.splice(0, splats.length - 85);
      }
    };

    // Initial ambient splats so screen starts with purple fluid plumes
    for (let i = 0; i < 8; i++) {
      addSplat(
        width * (0.25 + Math.random() * 0.5),
        height * (0.25 + Math.random() * 0.5),
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        1.2
      );
    }

    let lastMouseX = width / 2;
    let lastMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const vx = (x - lastMouseX) * 0.35;
      const vy = (y - lastMouseY) * 0.35;
      lastMouseX = x;
      lastMouseY = y;
      addSplat(x, y, vx, vy, 0.9);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const vx = (x - lastMouseX) * 0.35;
        const vy = (y - lastMouseY) * 0.35;
        lastMouseX = x;
        lastMouseY = y;
        addSplat(x, y, vx, vy, 0.9);
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // Periodic ambient purple splat generator
    const ambientInterval = setInterval(() => {
      const rx = width * (0.15 + Math.random() * 0.7);
      const ry = height * (0.2 + Math.random() * 0.6);
      const rvx = (Math.random() - 0.5) * 8;
      const rvy = (Math.random() - 0.5) * 8;
      addSplat(rx, ry, rvx, rvy, 1.15);
    }, 2200);

    const render = () => {
      // Soft dark fade trail for fluid dissipation feel
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";

      for (let i = splats.length - 1; i >= 0; i--) {
        const s = splats[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96; // velocity dissipation
        s.vy *= 0.96;
        s.radius *= 1.004; // slight expansion like dye dispersion
        s.alpha -= s.decay;

        if (s.alpha <= 0.008) {
          splats.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(
          s.x,
          s.y,
          s.radius * 0.05,
          s.x,
          s.y,
          s.radius
        );
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 68%, ${s.alpha})`);
        grad.addColorStop(0.45, `hsla(${s.hue - 6}, 95%, 48%, ${s.alpha * 0.6})`);
        grad.addColorStop(1, `hsla(${s.hue - 12}, 90%, 20%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(ambientInterval);
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
