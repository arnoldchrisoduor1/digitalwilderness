"use client";

import { motion } from "framer-motion";
import { MotionReveal } from "@/components/MotionReveal";
import { programSteps } from "@/lib/constants";

export function Programs() {
  return (
    <section className="section programs" id="programs">
      <div className="container grid-12">
        <MotionReveal className="programs-head">
          <span className="kicker">Programs</span>
          <h2>From research to fielded system.</h2>
          <p>
            Every program moves through the same five gates before it
            reaches the field. Nothing ships untested, and nothing skips a
            gate because the schedule says so.
          </p>
        </MotionReveal>

        <motion.div
          className="programs-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        />

        <div className="programs-steps">
          {programSteps.map((step, i) => (
            <MotionReveal key={step.num} delay={i * 0.08}>
              <div className="programs-step">
                <span className="num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
