"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MotionReveal } from "@/components/MotionReveal";
import { pipelineSteps } from "@/lib/constants";

function PipeStep({
  step,
  delay,
}: {
  step: (typeof pipelineSteps)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <MotionReveal delay={delay}>
      <div ref={ref} className={`pipe-step${inView ? " in" : ""}`}>
        <div className="pipe-dot">{step.num}</div>
        <h4>{step.title}</h4>
        <p>{step.description}</p>
      </div>
    </MotionReveal>
  );
}

export function Pipeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(lineRef, { once: true, amount: 0.3 });

  return (
    <section className="section pipeline" id="pipeline">
      <div className="container">
        <MotionReveal className="section-head">
          <span className="tag">03 — Hardware</span>
          <h2>
            From schematic to
            <br />
            shipped device.
          </h2>
          <p>
            Every board we build passes through the same five gates — nothing reaches a customer&apos;s hands untested.
          </p>
        </MotionReveal>

        <div className="pipe-track">
          <div ref={lineRef} className="pipe-line">
            <svg viewBox="0 0 1000 2" preserveAspectRatio="none">
              <motion.path
                d="M0 1 L1000 1"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="2"
                pathLength={1}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.6, ease: [0.4, 0.1, 0.2, 1] }}
              />
            </svg>
          </div>

          <div className="pipe-steps">
            {pipelineSteps.map((step, i) => (
              <PipeStep key={step.num} step={step} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
