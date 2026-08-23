import type { Metadata } from "next";
import { SchematicMark } from "@/components/graphics/SchematicMark";

export const metadata: Metadata = {
  title: "Ventures — Digital Wilderness",
  description:
    "Digital Wilderness holds a substantial stake in Haus of Tech, whose products include Haus of Wellness and Haus of Laundry.",
};

const ventures = [
  {
    name: "Haus of Tech",
    text: "The company Digital Wilderness holds a substantial stake in — it builds and operates a portfolio of consumer and service products.",
  },
  {
    name: "Haus of Wellness",
    text: "A Haus of Tech product in the wellness space.",
  },
  {
    name: "Haus of Laundry",
    text: "A Haus of Tech product in the laundry space.",
  },
];

export default function VenturesPage() {
  return (
    <main id="main-content">
      <section className="section page-hero">
        <div className="container grid-12">
          <div className="page-hero-content">
            <span className="kicker">Ventures</span>
            <h1>Beyond the lab.</h1>
            <p>
              Digital Wilderness holds a substantial stake in Haus of Tech, a
              company that has built multiple products outside of our own
              research and software work.
            </p>
          </div>

          <div className="page-hero-art">
            <SchematicMark variant={0} />
          </div>
        </div>
      </section>

      <section className="section blog-list">
        <div className="container grid-12">
          <div className="blog-grid">
            {ventures.map((venture) => (
              <div className="blog-card" key={venture.name}>
                <h3>{venture.name}</h3>
                <p className="excerpt">{venture.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
