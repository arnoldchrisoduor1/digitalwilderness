"use client";

import { motion } from "framer-motion";

const dots: [number, number][] = [
  [40, 100],
  [90, 40],
  [190, 100],
  [90, 220],
  [190, 220],
  [40, 280],
  [190, 340],
];

type NodeType = "accent" | "hollow" | "square";
type SchematicNode = { x: number; y: number; type: NodeType };
type SchematicVariant = { path: string; nodes: SchematicNode[] };

const variants: SchematicVariant[] = [
  {
    // zigzag
    path: "M40 40 L40 160 L140 160 L140 40 L240 40 L240 160 L240 280 L140 280 L140 340",
    nodes: [
      { x: 40, y: 40, type: "accent" },
      { x: 140, y: 160, type: "hollow" },
      { x: 240, y: 40, type: "hollow" },
      { x: 240, y: 160, type: "square" },
      { x: 240, y: 280, type: "hollow" },
      { x: 140, y: 280, type: "hollow" },
      { x: 140, y: 340, type: "accent" },
    ],
  },
  {
    // staircase
    path: "M40 320 L40 200 L140 200 L140 100 L240 100 L240 40",
    nodes: [
      { x: 40, y: 320, type: "accent" },
      { x: 40, y: 200, type: "hollow" },
      { x: 140, y: 200, type: "square" },
      { x: 140, y: 100, type: "hollow" },
      { x: 240, y: 100, type: "hollow" },
      { x: 240, y: 40, type: "accent" },
    ],
  },
  {
    // T-junction
    path: "M140 40 L140 200 M60 200 L220 200 L220 320",
    nodes: [
      { x: 140, y: 40, type: "accent" },
      { x: 140, y: 200, type: "square" },
      { x: 60, y: 200, type: "hollow" },
      { x: 220, y: 200, type: "hollow" },
      { x: 220, y: 320, type: "accent" },
    ],
  },
  {
    // loop + tail
    path: "M60 60 L220 60 L220 220 L60 220 L60 60 L60 320",
    nodes: [
      { x: 60, y: 60, type: "accent" },
      { x: 220, y: 60, type: "hollow" },
      { x: 220, y: 220, type: "square" },
      { x: 60, y: 220, type: "hollow" },
      { x: 60, y: 320, type: "accent" },
    ],
  },
];

const DRAW_DURATION = 1.6;

export function SchematicMark({
  className,
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const { path, nodes } = variants[variant % variants.length];

  return (
    <svg className={className} viewBox="0 0 280 380" fill="none" aria-hidden>
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill="currentColor" opacity={0.25} />
      ))}

      <motion.path
        d={path}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DRAW_DURATION, ease: [0.65, 0, 0.35, 1] }}
      />

      {nodes.map((node, i) => {
        const delay = nodes.length > 1 ? (i / (nodes.length - 1)) * DRAW_DURATION : 0;

        if (node.type === "accent") {
          return (
            <motion.circle
              key={`${node.x}-${node.y}`}
              cx={node.x}
              cy={node.y}
              r={5}
              fill="var(--color-accent)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
          );
        }

        if (node.type === "square") {
          return (
            <motion.rect
              key={`${node.x}-${node.y}`}
              x={node.x - 5}
              y={node.y - 5}
              width={10}
              height={10}
              stroke="currentColor"
              strokeWidth={1.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay }}
            />
          );
        }

        return (
          <motion.circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r={4}
            stroke="currentColor"
            strokeWidth={1.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay }}
          />
        );
      })}
    </svg>
  );
}
