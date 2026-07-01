"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className={`site-nav${scrolled ? " scrolled" : ""}`}
    >
      <a href="#" className="logo">
        <span className="dot" />
        {siteConfig.name}
      </a>

      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <a href="#contact" className="nav-cta nav-cta-desktop">
        Start a project
      </a>

      <a href="#contact" className="nav-cta nav-cta-mobile">
        Contact
      </a>
    </motion.nav>
  );
}
