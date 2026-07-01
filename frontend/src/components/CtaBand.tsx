"use client";

import { MotionReveal } from "@/components/MotionReveal";
import { siteConfig } from "@/lib/constants";

function ArrowIcon() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
      <path
        d="M1 5H15M15 5L10.5 1M15 5L10.5 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CtaBand() {
  return (
    <section className="section cta-band" id="contact">
      <div className="container">
        <MotionReveal>
          <span className="tag tag-center">Let&apos;s build</span>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <h2>Building something that needs to think, move, and respond in real time?</h2>
        </MotionReveal>
        <MotionReveal delay={0.2}>
          <p>
            Tell us what you&apos;re building — software, silicon, or something that hasn&apos;t been named yet.
            We&apos;ll tell you honestly whether we&apos;re the right fit.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.3}>
          <div className="cta-row">
            <a href={`mailto:${siteConfig.email}`} className="btn-primary">
              Start a project
            </a>
            <a href={`mailto:${siteConfig.email}`} className="btn-ghost">
              {siteConfig.email}
              <ArrowIcon />
            </a>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
