"use client";

import { MotionReveal } from "@/components/MotionReveal";
import { ThreeScene } from "@/components/canvas/ThreeScene";
import { showcaseFeatures } from "@/lib/constants";

function CheckIcon() {
  return (
    <svg className="ico" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 10L8 14L16 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Showcase() {
  return (
    <section className="section showcase" id="showcase">
      <div className="container">
        <div className="showcase-grid">
          <MotionReveal variant="pop">
            <div className="stage-frame">
              <div className="corner tl" />
              <div className="corner tr" />
              <div className="corner bl" />
              <div className="corner br" />
              <ThreeScene />
              <div className="stage-caption">
                <span className="pulse" />
                Live WebGL — drag to rotate
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.15} className="showcase-copy">
            <span className="tag">02 — Dimensional Web</span>
            <h2>
              We don&apos;t describe 3D.
              <br />
              We ship it.
            </h2>
            <p>
              The panel on the left is a real, running scene — not a video, not a screenshot. It&apos;s the same engine
              we use to build product configurators, data visualizations, and spatial brand experiences that hold
              attention on first load.
            </p>
            <ul className="feature-list">
              {showcaseFeatures.map((f) => (
                <li key={f.title}>
                  <CheckIcon />
                  <span>
                    <b>{f.title}</b> — {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
