export type ResearchSection = {
  heading?: string;
  paragraphs: string[];
};

export type ResearchDomain = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  tags: string[];
  sections: ResearchSection[];
  relatedPostSlug?: string;
};

export const researchDomains: ResearchDomain[] = [
  {
    slug: "mathematics",
    index: "01",
    title: "Mathematics",
    summary:
      "Control theory, optimization, and formal methods — the proofs that run before the prototypes, and the reason our systems behave the way we predict.",
    tags: ["Control Theory", "Optimization", "Formal Verification"],
    sections: [
      {
        heading: "The proofs before the prototypes",
        paragraphs: [
          "Every system we build starts as a set of equations before it's a line of code or a trace on a board. Mathematics is the discipline that decides, on paper, whether an approach can work at all — before time is spent building something that can't.",
        ],
      },
      {
        heading: "Control theory",
        paragraphs: [
          "Control theory is how we reason about systems that have to respond to a changing world in real time — a flight surface holding an attitude, a loop regulating a voltage rail. It gives us state-space models to describe how a system evolves, and feedback laws that keep it stable when conditions shift underneath it.",
          "This is also where the Extended Kalman Filter work we've written about lives — control and estimation are two sides of the same problem: acting on a system, and knowing its true state well enough to act correctly.",
        ],
      },
      {
        heading: "Optimization",
        paragraphs: [
          "Most real engineering problems have more than one valid answer and a limited budget — of power, weight, compute, or time. Optimization is the toolset for choosing well inside those constraints instead of guessing: trajectory planning, resource allocation, tuning a model against a hardware budget rather than against accuracy alone.",
        ],
      },
      {
        heading: "Formal verification",
        paragraphs: [
          "Testing shows a system worked for the cases you tried. Formal verification is the harder, narrower discipline of proving a system's behavior holds for every case in a defined class — used sparingly, on the parts of a system where a single unhandled edge case is not an acceptable outcome.",
        ],
      },
    ],
    relatedPostSlug: "extended-kalman-filters",
  },
  {
    slug: "electronics",
    index: "02",
    title: "Electronics",
    summary:
      "Analog and digital circuit design, signal integrity, and power systems — schematic to shipped board, built to survive conditions a datasheet won't tell you about.",
    tags: ["PCB Design", "Signal Integrity", "Power Systems"],
    sections: [
      {
        heading: "Schematic to shipped board",
        paragraphs: [
          "Electronics research here means the full path: schematic capture, component selection, layout, and the fabrication oversight that turns a design file into a board that actually works the first time it's powered on.",
        ],
      },
      {
        heading: "Signal integrity",
        paragraphs: [
          "At low speeds a trace is just a wire. At the speeds most modern systems run at, it's a transmission line — with impedance, reflections, and crosstalk that a purely schematic-level view won't catch. Getting this right is the difference between a board that works on the bench and one that works in the field, next to a motor or a radio.",
        ],
      },
      {
        heading: "Power systems",
        paragraphs: [
          "Regulation, efficiency, and thermal behavior aren't an afterthought bolted onto a design — they shape what the rest of the board can do. A control loop is only as fast as the power rail feeding it can settle, and a compute-heavy edge inference model is only field-deployable if its power budget survives the enclosure it ships in.",
        ],
      },
      {
        heading: "Why it sits next to the software",
        paragraphs: [
          "None of this stays confined to hardware. Power and thermal limits set the ceiling on what a model running on that board can actually do — which is why electronics and machine intelligence research happen in conversation with each other here, not in separate rooms.",
        ],
      },
    ],
  },
  {
    slug: "avionics",
    index: "03",
    title: "Avionics",
    summary:
      "Flight control systems, sensor fusion, and certification-grade reliability, for platforms where a software update can't fix a failure in the air.",
    tags: ["Flight Control", "Sensor Fusion", "EMI/EMC"],
    sections: [
      {
        heading: "Reliability first",
        paragraphs: [
          "Avionics research operates under a different standard than most software: a failure in the air can't be patched after the fact. That constraint shapes everything downstream of it — redundancy, testing rigor, and a bias toward well-understood techniques over clever ones.",
        ],
      },
      {
        heading: "Flight control systems",
        paragraphs: [
          "Flight control is applied control theory under hard real-time constraints — feedback loops holding attitude, altitude, or a trajectory, running on hardware that has to respond within a fixed, predictable time window every cycle, with no exceptions.",
        ],
      },
      {
        heading: "Sensor fusion",
        paragraphs: [
          "No single sensor is trustworthy enough on its own — an IMU drifts, GPS drops out, a barometer lags. Sensor fusion combines multiple noisy, partial sources into a single reliable estimate of where a platform actually is and how it's actually moving. This is the Extended Kalman Filter's home turf, and one of the more direct lines between our mathematics research and a fielded system.",
        ],
      },
      {
        heading: "EMI/EMC",
        paragraphs: [
          "A flight platform is a dense, electrically noisy environment, and it shares that environment with sensitive radios and control electronics. EMI/EMC work — understanding and containing electromagnetic interference — is unglamorous, mandatory, and exactly the kind of discipline that separates a working platform from one that only worked on the bench.",
        ],
      },
    ],
    relatedPostSlug: "extended-kalman-filters",
  },
  {
    slug: "machine-intelligence",
    index: "04",
    title: "Machine Intelligence",
    summary:
      "Edge inference and swarm coordination — models that decide on the device itself, when the round trip to a server is too slow to matter.",
    tags: ["Edge Inference", "Swarm Coordination", "Real-Time ML"],
    sections: [
      {
        heading: "Models that run on the device",
        paragraphs: [
          "Most machine learning research targets the cloud, where compute and power are effectively unlimited. Ours mostly doesn't — we're interested in what a model can do when it has to run on the device itself, under real constraints of power, memory, and latency, with no network round trip to fall back on.",
        ],
      },
      {
        heading: "Edge inference",
        paragraphs: [
          "Edge inference is a trade-off problem as much as a modeling problem: how much accuracy can be given up for a model that fits the compute and power budget of the hardware it actually has to run on. Our work on dense-prediction architectures like U-Net looks directly at this — how far a capable architecture can be trimmed before it stops being useful for the task at hand.",
        ],
      },
      {
        heading: "Swarm coordination",
        paragraphs: [
          "Some problems don't have a single point of failure to protect if they don't have a single point of control to begin with. Swarm coordination research looks at how many independent, resource-limited nodes can reach reasonable group decisions without a central controller — and where that coordination quality starts to break down as the network grows.",
        ],
      },
      {
        heading: "Real-time ML",
        paragraphs: [
          "A correct answer that arrives too late is often no better than a wrong one. Real-time ML research is about the systems-level work of making inference fast and predictable enough to sit inside a control loop — not just accurate in isolation.",
        ],
      },
    ],
    relatedPostSlug: "unet-cnn-dense-prediction",
  },
];

export function getResearchDomain(slug: string): ResearchDomain | undefined {
  return researchDomains.find((domain) => domain.slug === slug);
}
