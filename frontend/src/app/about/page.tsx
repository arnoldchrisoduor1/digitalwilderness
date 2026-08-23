import type { Metadata } from "next";
import Link from "next/link";
import { SchematicMark } from "@/components/graphics/SchematicMark";
import { affiliateNote } from "@/lib/constants";
import { researchDomains } from "@/lib/research";

export const metadata: Metadata = {
  title: "About — Digital Wilderness",
  description:
    "Digital Wilderness is a research lab first — mathematics, electronics, avionics, and machine intelligence, with software as the applied output.",
};

const principles = [
  {
    title: "Research leads.",
    text: "Everything we ship traces back to a research question we were already trying to answer — not the other way around.",
  },
  {
    title: "Constraints are honest.",
    text: "Power, weight, latency, and budget are design inputs from day one, not obstacles to route around after the fact.",
  },
  {
    title: "The unfinished work is shown too.",
    text: "Our blog carries work in progress, not just finished results — a live feed of the lab, not a highlight reel.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="section page-hero">
        <div className="container grid-12">
          <div className="page-hero-content">
            <span className="kicker">About</span>
            <h1>A lab built around research, not roadmaps.</h1>
            <p>
              Digital Wilderness runs sustained research programs across
              mathematics, electronics, avionics, and machine intelligence.
              The software and hardware we ship are downstream of that
              research — evidence it works, not the point of the exercise.
            </p>
            <div className="cta-row">
              <Link href="/careers" className="btn-primary">
                Join the research program
              </Link>
              <Link href="/#contact" className="btn-secondary">
                Contact
              </Link>
            </div>
          </div>

          <div className="page-hero-art">
            <SchematicMark variant={3} />
          </div>
        </div>
      </section>

      <section className="section blog-list">
        <div className="container grid-12">
          <div className="research-head">
            <span className="kicker">How we work</span>
            <h2>Three principles, held consistently.</h2>
          </div>

          <div className="blog-grid">
            {principles.map((principle) => (
              <div className="blog-card" key={principle.title}>
                <h3>{principle.title}</h3>
                <p className="excerpt">{principle.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section research">
        <div className="container grid-12">
          <div className="research-head">
            <span className="kicker">The four tracks</span>
            <h2>What the research covers.</h2>
            <p>
              Each discipline has its own page — where it fits, what it
              involves, and how it feeds the others.
            </p>
          </div>

          <div className="about-tracks page-hero-tracks">
            {researchDomains.map((domain) => (
              <Link href={`/research/${domain.slug}`} key={domain.slug}>
                {domain.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact">
        <div className="container grid-12">
          <div className="contact-head">
            <span className="kicker">Beyond the lab</span>
            <h2>Digital Wilderness also holds a stake in Haus of Tech.</h2>
            <p>{affiliateNote}</p>
            <div className="contact-cta">
              <Link href="/ventures" className="btn-secondary">
                See our ventures
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
