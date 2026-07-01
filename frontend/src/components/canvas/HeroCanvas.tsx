"use client";

import { useEffect, useRef } from "react";

const palette = ["#2be8c8", "#ffb15c", "#8b7cf6"];

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  c: string;
  tw: number;
  twSpeed: number;
};

export function TerrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const hy = h * 0.72;
      const rows = 14;

      for (let i = 0; i < rows; i++) {
        const t = i / rows;
        const y = hy + Math.pow(t, 1.8) * (h - hy) * 1.15;
        if (y > h) continue;
        const alpha = 0.16 * (1 - t) + 0.02;
        ctx.strokeStyle = `rgba(43,232,200,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const vanishX = w / 2;
      const cols = 22;
      for (let i = -cols; i <= cols; i++) {
        const spread = i / cols;
        const baseX = vanishX + spread * w * 1.3;
        const driftX = vanishX + (baseX - vanishX) + Math.sin(offsetRef.current * 0.0006 + i) * 4;
        const bottomX = vanishX + spread * w * 2.6;
        const grad = ctx.createLinearGradient(0, hy, 0, h);
        grad.addColorStop(0, "rgba(139,124,246,0.16)");
        grad.addColorStop(1, "rgba(43,232,200,0.03)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(driftX, hy);
        ctx.lineTo(bottomX, h);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(43,232,200,0.35)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(w, hy);
      ctx.stroke();

      offsetRef.current += 1;
      animId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 2;
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      canvas.style.transform = `translate(${px * 6}px, ${py * 4}px)`;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.85]"
      aria-hidden
    />
  );
}

export function MotesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId = 0;

    const initParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const count = Math.min(70, Math.floor(w / 16));
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.25 - 0.05,
        c: palette[Math.floor(Math.random() * palette.length)],
        tw: Math.random() * Math.PI * 2,
        twSpeed: Math.random() * 0.02 + 0.008,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += p.twSpeed;

        if (mouse.y !== null && mouse.y < h) {
          const dx = p.x - mouse.x!;
          const dy = p.y - mouse.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const f = ((140 - dist) / 140) * 0.5;
            p.x += (dx / dist) * f;
            p.y += (dy / dist) * f;
          }
        }

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.strokeStyle = `rgba(139,124,246,${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        const alpha = 0.4 + Math.sin(p.tw) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
