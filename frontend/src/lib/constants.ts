export const siteConfig = {
  name: "DIGITAL WILDERNESS",
  title: "Digital Wilderness — Software, 3D, Hardware & Edge AI Research",
  description:
    "A studio and research lab building software, 3D experiences, and hardware — plus an active edge-AI research track.",
  email: "hello@digitalwilderness.dev",
  coordinates: { lat: "-1.286N", lon: "36.817E", city: "NAIROBI" },
};

export const navLinks = [
  { label: "Work", href: "#capabilities" },
  { label: "Studio", href: "#showcase" },
  { label: "Research", href: "#research" },
  { label: "Contact", href: "#contact" },
];

export const capabilities = [
  {
    index: "01 · RT",
    title: "Real-Time Software",
    description:
      "Systems that can't afford to be late — trading engines, control loops, and live telemetry pipelines built for deterministic, millisecond-level response.",
    tags: ["Rust", "Go", "C++"],
  },
  {
    index: "02 · 3D",
    title: "Dimensional Web",
    description:
      "Product configurators, spatial storytelling, and WebGL experiences that turn a browser tab into something people actually want to explore.",
    tags: ["Three.js", "WebGL", "TypeScript"],
  },
  {
    index: "03 · HW",
    title: "Hardware Engineering",
    description:
      "Electronics taken from schematic to shipped product — PCB design, embedded firmware, prototyping, fabrication oversight, and environmental testing.",
    tags: ["KiCad", "Embedded C/Rust", "EMI/EMC"],
  },
  {
    index: "04 · R&D",
    title: "Applied Research",
    description:
      "An in-house research track on edge computing — fusing AI and hardware for swarm coordination and decision-making under real time constraints.",
    tags: ["Edge AI", "Swarm Systems", "Python"],
  },
];

export const showcaseFeatures = [
  {
    title: "Interactive by default",
    text: "every scene responds to pointer, scroll, and device orientation.",
  },
  {
    title: "Performance-first",
    text: "optimized geometry and draw calls so it's fast on real devices, not just demo machines.",
  },
  {
    title: "Built to convert",
    text: "motion with a job to do: guiding attention, not just decorating the page.",
  },
];

export const pipelineSteps = [
  {
    num: "01",
    title: "Design",
    description:
      "Schematic capture, component selection, and simulation before a single trace is routed.",
  },
  {
    num: "02",
    title: "Prototype",
    description:
      "Rapid-turn PCB spins and 3D-printed enclosures to validate form and fit early.",
  },
  {
    num: "03",
    title: "Fabricate",
    description:
      "Production-grade manufacturing oversight, from panelization to pick-and-place.",
  },
  {
    num: "04",
    title: "Test",
    description:
      "Functional, thermal, and EMI/EMC testing against real operating conditions.",
  },
  {
    num: "05",
    title: "Deploy",
    description:
      "Firmware provisioning, calibration, and field rollout with monitoring in place.",
  },
];

export const researchFeatures = [
  {
    title: "Edge inference architectures",
    text: "pushing AI models onto constrained devices, not just the cloud.",
  },
  {
    title: "Swarm coordination",
    text: "many small devices reaching group decisions with no single point of failure.",
  },
  {
    title: "Time-critical distributed pipelines",
    text: "data processed where it's created, when a round trip to a server is too slow.",
  },
  {
    title: "Hardware/software co-design",
    text: "building the chip layer and the model together instead of bolting one onto the other.",
  },
];

export const researchStats = [
  { count: 5, suffix: "ms", label: "Target control-loop latency" },
  { count: 120, suffix: "+", label: "Nodes per swarm simulation" },
  { count: 100, suffix: "%", label: "On-device inference, no cloud round trip" },
  { text: "24/7", label: "Designed for continuous operation" },
];

export const stackRows = [
  {
    lang: "Rust",
    bold: "For real-time and embedded systems",
    rest: " where a crash isn't an option — memory-safe, predictable, and fast enough for control loops and firmware alike.",
  },
  {
    lang: "C / C++",
    bold: "For firmware and low-level hardware control",
    rest: " — direct access to the metal when microseconds and register access matter.",
  },
  {
    lang: "Python",
    bold: "For machine learning research and rapid experimentation",
    rest: " — where iteration speed on an idea matters more than raw runtime performance.",
  },
  {
    lang: "Go",
    bold: "For distributed backends and services",
    rest: " that need to scale horizontally without drowning in complexity.",
  },
  {
    lang: "TS + WebGL",
    bold: "For interactive, spatial, and 3D web experiences",
    rest: " — type-safe on the front end, hardware-accelerated where it counts.",
  },
];

export const footerStudio = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "3D Showcase", href: "#showcase" },
  { label: "Hardware", href: "#pipeline" },
  { label: "Research", href: "#research" },
];

export const footerCompany = [
  { label: "Work", href: "#" },
  { label: "Process", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#contact" },
];

export const footerConnect = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "Email", href: `mailto:${siteConfig.email}` },
];
