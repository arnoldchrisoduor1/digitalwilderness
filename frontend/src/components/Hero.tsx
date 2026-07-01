"use client";

import { motion } from "framer-motion";
import { TerrainCanvas, MotesCanvas } from "@/components/canvas/HeroCanvas";
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

function HeroGlyph() {
  const paths = [
    { d: "M280 118 L280 70", stroke: "#2be8c8", opacity: 0.9, delay: 1.4 },
    { d: "M280 84 C 250 66, 220 58, 190 30", stroke: "#2be8c8", opacity: 0.8, delay: 1.6 },
    { d: "M280 84 C 310 66, 340 58, 370 30", stroke: "#ffb15c", opacity: 0.8, delay: 1.6 },
    { d: "M280 70 C 265 48, 255 34, 240 8", stroke: "#8b7cf6", opacity: 0.75, delay: 1.8 },
    { d: "M280 70 C 295 48, 305 34, 320 8", stroke: "#8b7cf6", opacity: 0.75, delay: 1.8 },
    { d: "M190 30 C 170 22, 150 20, 128 6", stroke: "#2be8c8", opacity: 0.55, delay: 2 },
    { d: "M370 30 C 390 22, 410 20, 432 6", stroke: "#ffb15c", opacity: 0.55, delay: 2 },
    { d: "M240 8 L 232 -4", stroke: "#8b7cf6", opacity: 0.4, delay: 2.2 },
    { d: "M320 8 L 328 -4", stroke: "#8b7cf6", opacity: 0.4, delay: 2.2 },
  ];

  return (
    <motion.svg
      className="glyph"
      viewBox="0 0 560 120"
      preserveAspectRatio="xMidYMid meet"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 1 }}
      aria-hidden
    >
      {paths.map((p) => (
        <motion.path
          key={p.d}
          d={p.d}
          fill="none"
          stroke={p.stroke}
          strokeWidth={1.1}
          strokeLinecap="round"
          opacity={p.opacity}
          pathLength={1}
          initial={{ strokeDashoffset: 1, strokeDasharray: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ delay: p.delay, duration: 2.6, ease: [0.4, 0.1, 0.2, 1] }}
        />
      ))}
    </motion.svg>
  );
}

export function Hero() {
  return (
    <div className="scene">
      <TerrainCanvas />
      <MotesCanvas />

      <div className="coord tl">
        LAT <span>{siteConfig.coordinates.lat}</span> · LON <span>{siteConfig.coordinates.lon}</span>
      </div>
      <div className="coord br">
        SIGNAL <span>STRONG</span>
        <br />
        REC / LIVE
      </div>

      <div className="hero">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Websites built for the wild
        </motion.div>

        <h1>
          <span className="row">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.65, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Where code
            </motion.span>
          </span>
          <span className="row gradient">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.78, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              grows wild
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
        >
          We design and build <b>sleek, high-performance websites</b> for brands who refuse to blend in — every scroll,
          hover, and load engineered to hold attention from the first frame.
        </motion.p>

        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8 }}
        >
          <a href="#capabilities" className="btn-primary">
            See our work
          </a>
          <a href="#contact" className="btn-ghost">
            Book a call
            <ArrowIcon />
          </a>
        </motion.div>

        <HeroGlyph />

        <motion.div
          className="scroll-cue"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span>Scroll</span>
          <div className="track" />
        </motion.div>
      </div>
    </div>
  );
}
