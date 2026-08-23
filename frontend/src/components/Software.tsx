import { MotionReveal } from "@/components/MotionReveal";
import { softwareCapabilities, stackRows } from "@/lib/constants";

export function Software() {
  return (
    <section className="section software" id="software">
      <div className="container grid-12">
        <MotionReveal className="software-head">
          <span className="kicker">Software</span>
          <h2>The applied output, not the starting point.</h2>
          <p>
            We don&apos;t have a house stack — we have a decision tree.
            Every project starts by asking what the research and the
            constraint actually require, then builds two kinds of software
            on top of it.
          </p>
        </MotionReveal>

        <div className="software-caps">
          {softwareCapabilities.map((cap, i) => (
            <MotionReveal key={cap.index} delay={i * 0.1}>
              <div className="software-cap">
                <span className="num">{cap.index}</span>
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
                <div className="tags">
                  {cap.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        <div className="software-stack">
          {stackRows.map((row, i) => (
            <MotionReveal key={row.lang} delay={i * 0.05}>
              <div className="software-stack-row">
                <div className="lang">{row.lang}</div>
                <div className="desc">
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
