export type WorkCategory =
  | "product"
  | "visual"
  | "graphic"
  | "illustration";

export interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  description: string;
  year: string;
  tags: string[];
  color: string;
}

export const works: Work[] = [
  {
    id: "aurora",
    title: "Aurora",
    category: "product",
    description:
      "A meditation app that translates breathing patterns into real-time aurora landscapes. Designed the full product experience from concept to interactive prototype.",
    year: "2025",
    tags: ["Product Design", "UI/UX", "Motion"],
    color: "#6b7ce0",
  },
  {
    id: "fragment",
    title: "Frag·ment",
    category: "visual",
    description:
      "An experimental visual exploration of memory fragmentation through layered photography and generative glitch processes.",
    year: "2025",
    tags: ["Visual", "Photography", "Glitch"],
    color: "#e06b6b",
  },
  {
    id: "typeform",
    title: "Typeform Zero",
    category: "graphic",
    description:
      "A bespoke display typeface system inspired by brutalist architecture — 3 weights, variable axes, and a companion glyph library.",
    year: "2024",
    tags: ["Typography", "Brand", "Print"],
    color: "#e8ad68",
  },
  {
    id: "dreams",
    title: "Dongs in Dreams",
    category: "illustration",
    description:
      "A personal illustration series exploring surreal dreamscapes through a restrained palette of ink, gouache, and digital line work.",
    year: "2024",
    tags: ["Illustration", "Personal", "Series"],
    color: "#7ce0a8",
  },
  {
    id: "pulse",
    title: "Pulse Dashboard",
    category: "product",
    description:
      "A real-time analytics dashboard for creative teams, balancing dense data with calm visual hierarchy. Built with custom chart primitives.",
    year: "2024",
    tags: ["Product Design", "Data Viz", "Design System"],
    color: "#b86ce0",
  },
  {
    id: "ritual",
    title: "Ritual Marks",
    category: "graphic",
    description:
      "A visual identity system for a ceramicist — hand-drawn marks, stamp systems, and packaging that frames each piece as a small ritual object.",
    year: "2025",
    tags: ["Branding", "Identity", "Packaging"],
    color: "#6ce0c4",
  },
  {
    id: "echo",
    title: "Echo Garden",
    category: "illustration",
    description:
      "An interactive web illustration where plant growth responds to your voice — created for a seasonal Google Doodle commission.",
    year: "2025",
    tags: ["Illustration", "Web", "Interactive"],
    color: "#e0c46c",
  },
  {
    id: "monolith",
    title: "Monolith",
    category: "visual",
    description:
      "A site-specific visual installation exploring the dialogue between ancient stone and generative light. Shown at Beijing Design Week.",
    year: "2023",
    tags: ["Installation", "Generative", "Exhibition"],
    color: "#6b7ce0",
  },
];

export const categories: { key: WorkCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "product", label: "Product" },
  { key: "visual", label: "Visual" },
  { key: "graphic", label: "Graphic" },
  { key: "illustration", label: "Illustration" },
];