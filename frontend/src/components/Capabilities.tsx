"use client";

import { useRef } from "react";
import { MotionReveal } from "@/components/MotionReveal";
import { capabilities } from "@/lib/constants";

function TiltCard({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const cardRef = useRef<HTMLElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 8;
    const ry = (px - 0.5) * 8;
    card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <MotionReveal variant="pop" delay={delay} className="cap-cell">
      <article
        ref={cardRef}
        className="card"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="card-glow" />
        {children}
      </article>
    </MotionReveal>
  );
}

export function Capabilities() {
  return (
    <section className="section capabilities" id="capabilities">
      <div className="container">
        <MotionReveal className="section-head">
          <span className="tag">01 — Capabilities</span>
          <h2>
            Software to silicon,
            <br />
            real-time to research.
          </h2>
          <p>
            Four disciplines under one roof — we move fluidly between the browser, the board, and the lab, picking the
            tool the problem actually demands.
          </p>
        </MotionReveal>

        <div className="cap-grid">
          {capabilities.map((cap, i) => (
            <TiltCard key={cap.index} delay={i * 0.1}>
              <span className="card-index">{cap.index}</span>
              <h3>{cap.title}</h3>
              <p>{cap.description}</p>
              <div className="card-stack">
                {cap.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
