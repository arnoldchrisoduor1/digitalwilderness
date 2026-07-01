"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[200] h-0.5 transition-[width] duration-100 linear"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, var(--teal), var(--violet), var(--amber))",
      }}
    />
  );
}
