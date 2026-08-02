"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { works, categories, Work, WorkCategory } from "@/lib/works";

function WorkCard({ work, index }: { work: Work; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="work-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="work-card-visual"
        style={{ backgroundColor: work.color }}
      >
        <motion.div
          className="work-card-shape"
          animate={{
            rotate: isHovered ? [0, 90, 90] : [0, 0],
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.6 }}
        />
        <span className="work-card-year">{work.year}</span>
      </div>

      <div className="work-card-info">
        <div className="work-card-header">
          <h3 className="work-card-title">{work.title}</h3>
          <motion.span
            className="work-card-arrow"
            animate={{ x: isHovered ? 6 : 0, opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            →
          </motion.span>
        </div>
        <p className="work-card-desc">{work.description}</p>
        <div className="work-card-tags">
          {work.tags.map((tag) => (
            <span key={tag} className="work-card-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <motion.div className="work-card-hover-bar"
        style={{ backgroundColor: work.color }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
}

export default function WorksSection() {
  const [activeFilter, setActiveFilter] = useState<WorkCategory | "all">("all");

  const filtered =
    activeFilter === "all"
      ? works
      : works.filter((w) => w.category === activeFilter);

  return (
    <section className="portfolio-works">
      <motion.div
        className="works-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="about-label">
          <span className="about-label-num">02</span>
          <span className="about-label-text">Selected Works</span>
        </div>

        <h2 className="works-heading">
          Things I&apos;ve made <span className="works-heading-accent">with care.</span>
        </h2>

        <div className="works-filters">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`works-filter ${activeFilter === cat.key ? "active" : ""}`}
              onClick={() => setActiveFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>


      <motion.div className="works-grid" layout>
        {filtered.map((work, i) => (
          <WorkCard key={work.id} work={work} index={i} />
        ))}
      </motion.div>
    </section>
  );
}