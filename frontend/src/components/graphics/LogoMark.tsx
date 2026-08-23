"use client";

import { motion } from "framer-motion";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M6 6 L6 22 L22 22"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle cx={6} cy={6} r={2.5} stroke="currentColor" strokeWidth={2} />
      <motion.circle
        cx={22}
        cy={22}
        r={3}
        fill="var(--color-accent)"
        animate={{ opacity: [1, 0.55, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}
