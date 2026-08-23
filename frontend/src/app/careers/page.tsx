import type { Metadata } from "next";
import Link from "next/link";
import { SchematicMark } from "@/components/graphics/SchematicMark";
import { siteConfig } from "@/lib/constants";
import { researchDomains } from "@/lib/research";

export const metadata: Metadata = {
  title: "Careers — Digital Wilderness",
  description:
    "Digital Wilderness isn't hiring for open roles right now. Email in to join the research program instead.",
};

export default function CareersPage() {
  return (
    <main id="main-content">
      <section className="section page-hero">
        <div className="container grid-12">
          <div className="page-hero-content">
            <span className="kicker">Careers</span>
            <h1>No open roles right now.</h1>
            <p>
              Digital Wilderness isn&apos;t hiring for a fixed position at the
              moment. If you want to work with the research directly, the
              door in is the research program, not a job posting.
            </p>
            <p>
              Email us about the track you want to contribute to —
              mathematics, electronics, avionics, or machine intelligence.
              Approved collaborators get access to our data and active
              research threads.
            </p>
            <div className="cta-row">
              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                  "Research Program Inquiry"
                )}`}
                className="btn-primary"
              >
                Email the lab
              </a>
            </div>
            <div className="page-hero-tracks">
              {researchDomains.map((domain) => (
                <Link href={`/research/${domain.slug}`} key={domain.slug}>
                  {domain.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="page-hero-art">
            <SchematicMark variant={1} />
          </div>
        </div>
      </section>
    </main>
  );
}
