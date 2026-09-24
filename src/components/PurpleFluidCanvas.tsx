"use client";
import React, { useEffect, useRef } from "react";

interface ParticleSplat {
  x: number; y: number; vx: number; vy: number;
  radius: number; alpha: number; hue: number; decay: number;
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

    const addSplat = (x: number, y: number, vx: number, vy: number, scale = 1) => {
      for (let i = 0; i < 2; i++) {
        splats.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: vx * (0.3 + Math.random() * 0.6) + (Math.random() - 0.5) * 1,
          vy: vy * (0.3 + Math.random() * 0.6) + (Math.random() - 0.5) * 1,
          radius: (80 + Math.random() * 120) * scale,
          alpha: 0.18 + Math.random() * 0.18,
          hue: 282 + Math.random() * 14,
          decay: 0.0025 + Math.random() * 0.003,
        });
      }
      if (splats.length > 40) splats.splice(0, splats.length - 40);
    };

    for (let i = 0; i < 6; i++) {
      addSplat(width * (0.3 + Math.random() * 0.4), height * (0.2 + Math.random() * 0.6), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 1.1);
    }

    let lastX = width / 2, lastY = height / 2;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      addSplat(x, y, (x - lastX) * 0.25, (y - lastY) * 0.25, 0.7);
      lastX = x; lastY = y;
    };
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    const interval = setInterval(() => {
      addSplat(width * (0.2 + Math.random() * 0.6), height * (0.2 + Math.random() * 0.7), (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, 1);
    }, 3200);

    const render = () => {
      ctx.fillStyle = "rgba(8,8,10,0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";
      for (let i = splats.length - 1; i >= 0; i--) {
        const s = splats[i];
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.965; s.vy *= 0.965;
        s.radius *= 1.003;
        s.alpha -= s.decay;
        if (s.alpha <= 0.01) { splats.splice(i, 1); continue; }
        const grad = ctx.createRadialGradient(s.x, s.y, s.radius * 0.08, s.x, s.y, s.radius);
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 68%, ${s.alpha})`);
        grad.addColorStop(0.5, `hsla(${s.hue - 4}, 90%, 45%, ${s.alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${s.hue - 10}, 85%, 18%, 0)`);
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
      clearInterval(interval);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.55]" />;
}
