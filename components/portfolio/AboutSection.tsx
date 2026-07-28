"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="portfolio-about">
      <motion.div
        className="about-inner"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="about-label">
          <span className="about-label-num">01</span>
          <span className="about-label-text">About</span>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <h2 className="about-heading">
              I make <em>strange, useful</em> things
              <br />
              for <span className="about-accent">screen &amp; paper.</span>
            </h2>

            <div className="about-body">
              <p>
                I&apos;m a designer and illustrator working at the intersection of
                product thinking and visual storytelling. My practice moves
                between systems — design systems, product ecosystems, brand
                architectures — and the handmade: illustration, typography,
                and the occasional generative experiment.
              </p>
              <p>
                Over the past six years, I&apos;ve collaborated with startups,
                cultural institutions, and the occasional stranger on a train.
                I believe good design is a conversation, and great design is a
                conversation worth remembering.
              </p>
            </div>
          </div>

          <div className="about-meta">
            <div className="about-meta-item">
              <span className="about-meta-label">Based in</span>
              <span className="about-meta-value">Somewhere between<br />Beijing &amp; the internet</span>
            </div>
            <div className="about-meta-item">
              <span className="about-meta-label">Currently</span>
              <span className="about-meta-value">Designing dream interfaces<br />for a meditation startup</span>
            </div>
            <div className="about-meta-item">
              <span className="about-meta-label">Previously</span>
              <span className="about-meta-value">Senior Product Designer<br />@ Studio Aurora</span>
            </div>
            <div className="about-meta-item">
              <span className="about-meta-label">Say hi</span>
              <span className="about-meta-value">hello@yourstudio.com</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}