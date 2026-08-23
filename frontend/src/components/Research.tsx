import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";
import { StatCounter } from "@/components/StatCounter";
import { researchStats } from "@/lib/constants";
import { researchDomains } from "@/lib/research";

export function Research() {
  return (
    <section className="section research" id="research">
      <div className="container grid-12">
        <MotionReveal className="research-head">
          <span className="kicker">Research</span>
          <h2>Four disciplines. One lab.</h2>
          <p>
            Digital Wilderness runs sustained research programs across four
            disciplines. Each track feeds the others — the mathematics
            sharpens the hardware, the hardware constrains the models, and
            all three feed the software we eventually ship.
          </p>
        </MotionReveal>

        <div className="research-tracks">
          {researchDomains.map((domain, i) => (
            <MotionReveal key={domain.slug} delay={i * 0.08}>
              <Link href={`/research/${domain.slug}`} className="research-track">
                <span className="num">{domain.index}</span>
                <h3>{domain.title}</h3>
                <p>{domain.summary}</p>
                <div className="tags">
                  {domain.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="read-more">Read more →</span>
              </Link>
            </MotionReveal>
          ))}
        </div>

        <div className="research-stats">
          {researchStats.map((stat, i) => (
            <MotionReveal key={stat.label} delay={i * 0.06}>
              <StatCounter value={stat.value} label={stat.label} />
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
