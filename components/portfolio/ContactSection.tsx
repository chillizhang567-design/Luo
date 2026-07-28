"use client";

import { motion } from "framer-motion";

const links = [
  { label: "Email", value: "hello@yourstudio.com", href: "mailto:hello@yourstudio.com" },
  { label: "Instagram", value: "@your.handle", href: "#" },
  { label: "Dribbble", value: "yourhandle", href: "#" },
  { label: "Are.na", value: "your-channel", href: "#" },
];

export default function ContactSection() {
  return (
    <section className="portfolio-contact">
      <motion.div
        className="contact-inner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
      >
        <div className="about-label">
          <span className="about-label-num">03</span>
          <span className="about-label-text">Contact</span>
        </div>

        <motion.h2
          className="contact-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Let&apos;s make
          <br />
          <span className="contact-heading-accent">something real.</span>
        </motion.h2>

        <motion.p
          className="contact-description"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          I&apos;m always interested in thoughtful collaborations —
          product design, brand identity, illustration commissions,
          or just a good conversation about design.
        </motion.p>

        <motion.div
          className="contact-links"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="contact-link"
            >
              <span className="contact-link-label">{link.label}</span>
              <span className="contact-link-value">{link.value}</span>
              <span className="contact-link-arrow">→</span>
            </a>
          ))}
        </motion.div>

        <motion.div
          className="contact-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p>© 2025 Your Studio. Made with care in the clouds.</p>
          <p className="contact-footer-available">
            <span className="contact-dot" />
            Available for new work — Summer 2025
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}