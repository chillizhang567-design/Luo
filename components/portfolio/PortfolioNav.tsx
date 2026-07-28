"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const navItems = [
  { label: "Work", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioNav() {
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(5, 12, 25, 0)", "rgba(5, 12, 25, 0.85)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 224, 176, 0.08)"]
  );

  return (
    <motion.nav
      className="portfolio-nav"
      style={{ backgroundColor: headerBg, borderColor: headerBorder }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <a href="#" className="portfolio-nav-logo">
        <span className="logo-mark">◐</span>
        <span className="logo-text">Your Studio</span>
      </a>

      <div className="portfolio-nav-links">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className="portfolio-nav-link">
            {item.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}