"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SchematicMark } from "@/components/graphics/SchematicMark";
import { researchDomains } from "@/lib/research";

export function Hero() {
  return (
    <section className="hero">
      <div className="container grid-12">
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="kicker">Applied Research Lab</span>
        </motion.div>

        <motion.h1
          className="hero-heading"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          We research the systems others build on.
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Digital Wilderness is an R&amp;D lab working across mathematics,
          electronics, avionics, and machine intelligence. The software we
          ship is an applied output of that research — not the starting
          point.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a href="#research" className="btn-primary">
            View research
          </a>
          <a href="#contact" className="btn-secondary">
            Contact
          </a>
        </motion.div>

        <div className="hero-art">
          <SchematicMark />
        </div>

        <motion.div
          className="hero-domains"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {researchDomains.map((domain) => (
            <Link href={`/research/${domain.slug}`} className="hero-domain" key={domain.slug}>
              <span className="num">{domain.index}</span>
              <span className="label">{domain.title}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
