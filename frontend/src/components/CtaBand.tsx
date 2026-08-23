"use client";

import { SchematicMark } from "@/components/graphics/SchematicMark";
import { MotionReveal } from "@/components/MotionReveal";
import { siteConfig } from "@/lib/constants";

export function CtaBand() {
  return (
    <section className="section contact" id="contact">
      <div className="container grid-12">
        <MotionReveal className="contact-head">
          <span className="kicker">Contact</span>
          <h2>Bring us the problem before you bring us the spec.</h2>
          <p>
            Tell us what you&apos;re working on — a model, a board, a control
            loop, a system that has to hold up in the field. We&apos;ll tell
            you honestly whether it&apos;s a fit for what we research.
          </p>
          <div className="contact-cta">
            <a href={`mailto:${siteConfig.email}`} className="btn-primary">
              Start a conversation
            </a>
            <a href={`mailto:${siteConfig.email}`} className="btn-secondary">
              {siteConfig.email}
            </a>
          </div>
        </MotionReveal>

        <div className="contact-art">
          <SchematicMark variant={2} />
        </div>
      </div>
    </section>
  );
}
