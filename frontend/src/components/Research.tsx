"use client";

import { useEffect, useRef, useState } from "react";
import { SwarmCanvas } from "@/components/canvas/SwarmCanvas";
import { MotionReveal } from "@/components/MotionReveal";
import { researchFeatures, researchStats } from "@/lib/constants";
import { useInView } from "framer-motion";

function SwarmIcon() {
  return (
    <svg className="ico" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="3" fill="currentColor" />
      <circle cx="4" cy="4" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="16" cy="4" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function StatCounter({
  count,
  suffix,
  text,
  label,
  delay,
}: {
  count?: number;
  suffix?: string;
  text?: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(text ?? `0${suffix ?? ""}`);

  useEffect(() => {
    if (!inView) return;
    if (text) {
      setDisplay(text);
      return;
    }
    if (count === undefined) return;

    const dur = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${Math.round(count * eased)}${suffix ?? ""}`);
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, count, suffix, text]);

  return (
    <MotionReveal delay={delay}>
      <div className="stat">
        <div ref={ref} className="stat-num">
          {display}
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </MotionReveal>
  );
}

export function Research() {
  return (
    <section className="section research" id="research">
      <SwarmCanvas />
      <div className="container">
        <div className="research-grid">
          <div className="research-copy">
            <MotionReveal>
              <span className="tag">04 — Applied Research</span>
              <h2>
                Intelligence at the edge.
                <br />
                Decisions in milliseconds.
              </h2>
              <p>
                Alongside client work, we run an active research track exploring how AI and hardware converge when the
                network can&apos;t be trusted to be there. The field behind this text is a live simulation — independent
                nodes, no central controller, forming and breaking connections on the fly.
              </p>
              <ul className="feature-list" style={{ marginTop: 26 }}>
                {researchFeatures.map((f) => (
                  <li key={f.title}>
                    <SwarmIcon />
                    <span>
                      <b>{f.title}</b> — {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </MotionReveal>

            <div className="research-stats">
              {researchStats.map((stat, i) => (
                <StatCounter
                  key={stat.label}
                  count={"count" in stat ? stat.count : undefined}
                  suffix={"suffix" in stat ? stat.suffix : undefined}
                  text={"text" in stat ? stat.text : undefined}
                  label={stat.label}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
          <div aria-hidden />
        </div>
      </div>
    </section>
  );
}
