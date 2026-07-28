"use client";

import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import WorksSection from "./WorksSection";
import ContactSection from "./ContactSection";
import PortfolioNav from "./PortfolioNav";

export default function Portfolio() {
  return (
    <div className="portfolio-root">
      <PortfolioNav />
      <HeroSection />
      <div id="about"><AboutSection /></div>
      <div id="works"><WorksSection /></div>
      <div id="contact"><ContactSection /></div>
    </div>
  );
}