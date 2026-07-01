"use client";

import { MotionReveal } from "@/components/MotionReveal";
import { stackRows } from "@/lib/constants";

export function Stack() {
  return (
    <section className="section stack" id="stack">
      <div className="container">
        <MotionReveal className="section-head">
          <span className="tag">05 — Approach</span>
          <h2>
            The right language
            <br />
            for the constraint.
          </h2>
          <p>
            We don&apos;t have a house stack — we have a decision tree. Every project starts by asking what the problem
            actually requires.
          </p>
        </MotionReveal>

        <div className="stack-list">
          {stackRows.map((row, i) => (
            <MotionReveal key={row.lang} delay={i * 0.05}>
              <div className="stack-row">
                <div className="stack-lang">
                  <span className="b" />
                  {row.lang}
                </div>
                <div className="stack-desc">
                  <b>{row.bold}</b>
                  {row.rest}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
