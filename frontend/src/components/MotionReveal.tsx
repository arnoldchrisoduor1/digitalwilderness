"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 38 },
  visible: { opacity: 1, y: 0 },
};

const popVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateX: 14,
    y: 46,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
  },
};

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "reveal" | "pop" | "side";
  sideX?: number;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  variant = "reveal",
  sideX,
}: MotionRevealProps) {
  const variants =
    variant === "pop"
      ? popVariants
      : variant === "side"
        ? {
            hidden: { opacity: 0, x: sideX ?? -40 },
            visible: { opacity: 1, x: 0 },
          }
        : revealVariants;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      variants={variants}
      transition={{ duration: variant === "pop" ? 1 : 0.9, delay, ease }}
      style={variant === "pop" ? { transformPerspective: 1200 } : undefined}
    >
      {children}
    </motion.div>
  );
}
