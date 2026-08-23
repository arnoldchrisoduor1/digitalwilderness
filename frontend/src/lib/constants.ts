export const siteConfig = {
  name: "DIGITAL WILDERNESS",
  url: "https://digitalwilderness.dev",
  title: "Digital Wilderness — Applied Research in Systems & Intelligence",
  description:
    "An R&D lab researching mathematics, electronics, avionics, and machine intelligence — and building the software that puts that research into the field.",
  email: "hello@digitalwilderness.dev",
  coordinates: { lat: "-1.286N", lon: "36.817E", city: "NAIROBI" },
};

export const affiliateNote =
  "Digital Wilderness holds a substantial stake in Haus of Tech, whose products include Haus of Wellness and Haus of Laundry.";

export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/#research" },
  { label: "Programs", href: "/#programs" },
  { label: "Software", href: "/#software" },
  { label: "Contact", href: "/#contact" },
];

export const softwareCapabilities = [
  {
    index: "01",
    title: "Real-Time Software",
    description:
      "Systems that can't afford to be late — control loops, telemetry pipelines, and decision systems built for deterministic, millisecond-level response.",
    tags: ["Rust", "Go", "C++"],
  },
  {
    index: "02",
    title: "Dimensional Web",
    description:
      "Product configurators and spatial interfaces that put research and hardware in front of people who'll never open a datasheet.",
    tags: ["Three.js", "WebGL", "TypeScript"],
  },
];

export const programSteps = [
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

export const researchStats = [
  { value: "5ms", label: "Target control-loop latency" },
  { value: "120+", label: "Nodes per swarm simulation" },
  { value: "100%", label: "On-device inference, no cloud round trip" },
  { value: "24/7", label: "Designed for continuous operation" },
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

export const footerLab = [
  { label: "Research", href: "/#research" },
  { label: "Programs", href: "/#programs" },
  { label: "Software", href: "/#software" },
  { label: "Contact", href: "/#contact" },
];

export const footerCompany = [
  { label: "About", href: "/about" },
  { label: "Ventures", href: "/ventures" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#contact" },
];

export const footerConnect = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "Email", href: `mailto:${siteConfig.email}` },
];
