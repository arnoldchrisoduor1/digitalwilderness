"use client";

import { useEffect, useRef } from "react";

type SwarmNode = { x: number; y: number; vx: number; vy: number; r: number };
type Packet = { i: number; j: number; t: number };

export function SwarmCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const nodesRef = useRef<SwarmNode[]>([]);
  const packetsRef = useRef<Packet[]>([]);

  useEffect(() => {
    sectionRef.current = canvasRef.current?.closest("section") ?? null;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId = 0;

    const initSwarm = () => {
      const w = section.offsetWidth;
      const h = section.offsetHeight;
      const n = Math.min(46, Math.floor(w / 34));
      nodesRef.current = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 1.4,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = section.offsetWidth * dpr;
      canvas.height = section.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initSwarm();
    };

    const draw = () => {
      const w = section.offsetWidth;
      const h = section.offsetHeight;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const nodes = nodesRef.current;
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      });

      const links: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        let nearest: number | null = null;
        let nd = Infinity;
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < nd) {
            nd = d;
            nearest = j;
          }
        }
        if (nearest !== null && Math.sqrt(nd) < 160) {
          links.push([i, nearest]);
        }
      }

      links.forEach(([i, j]) => {
        const a = nodes[i];
        const b = nodes[j];
        ctx.strokeStyle = "rgba(43,232,200,0.14)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      if (Math.random() < 0.045 && links.length) {
        const [i, j] = links[Math.floor(Math.random() * links.length)];
        packetsRef.current.push({ i, j, t: 0 });
      }

      packetsRef.current.forEach((p) => {
        p.t += 0.02;
        const a = nodes[p.i];
        const b = nodes[p.j];
        if (!a || !b) return;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.fillStyle = "#ffb15c";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffb15c";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      packetsRef.current = packetsRef.current.filter((p) => p.t < 1);

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(139,124,246,0.85)";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#8b7cf6";
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
      aria-hidden
    />
  );
}
