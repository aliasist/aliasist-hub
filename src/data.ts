export type Status = "live" | "beta" | "soon" | "unknown";

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: Status;
  category: "Flagship" | "Live App" | "Tool" | "Brand";
  accent: string;
  glyph: string;
  highlights: string[];
  repo?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "datasist",
    name: "DataSist",
    tagline: "AI Data Center Intelligence",
    description:
      "Live tracking of AI infrastructure: facilities, grid load, and utility risk signals shaping the build-out of compute.",
    url: "https://datasist.aliasist.com",
    status: "live",
    category: "Flagship",
    accent: "#0acb9b",
    glyph: "◇",
    highlights: ["Facilities map", "Grid risk", "Utility signals"],
  },
  {
    id: "pulsesist",
    name: "PulseSist",
    tagline: "Adversarial Market Intelligence",
    description:
      "Real-time market dashboard with charts, news scrubber, AI research chat, top-50 universe, and a full pitch builder.",
    url: "https://pulse.aliasist.com",
    status: "live",
    category: "Live App",
    accent: "#0acb9b",
    glyph: "▲",
    highlights: ["Live quotes", "AI research", "Pitch builder"],
  },
  {
    id: "spacesist",
    name: "SpaceSist",
    tagline: "Live Space Portal",
    description:
      "APOD, ISS tracker, SpaceX launches, near-Earth asteroids, exoplanet catalogues, and cosmic galleries in one surface.",
    url: "https://space.aliasist.com",
    status: "live",
    category: "Live App",
    accent: "#06b6d4",
    glyph: "◯",
    highlights: ["ISS tracking", "APOD", "Asteroid feed"],
  },
  {
    id: "ecosist",
    name: "EcoSist",
    tagline: "Environmental Intelligence",
    description:
      "Single hub for grid emissions, air quality, weather, and biodiversity — real-time views with map-driven exploration.",
    url: "https://ecosist.aliasist.com",
    status: "live",
    category: "Live App",
    accent: "#0acb9b",
    glyph: "◈",
    highlights: ["Grid emissions", "Air quality", "Map UX"],
  },
  {
    id: "abductor",
    name: "Files Abductor",
    tagline: "File Cleanup Automation",
    description:
      "Alien-themed file organization tool that turns recurring cleanup chores into a single, repeatable workflow.",
    url: "https://aliasist.tech",
    status: "beta",
    category: "Tool",
    accent: "#06956e",
    glyph: "◬",
    highlights: ["Auto-sort", "Rules engine", "CLI-friendly"],
  },
  {
    id: "portfolio",
    name: "aliasist.com",
    tagline: "Developer Portfolio + Writing",
    description:
      "The portfolio, research notes, and build logs from Blake — case studies, posts, and the skill set behind the suite.",
    url: "https://aliasist.com",
    status: "live",
    category: "Brand",
    accent: "#7a9085",
    glyph: "✦",
    highlights: ["Case studies", "Build logs", "Contact"],
  },
];

export const SUITE_STATS = [
  { label: "Live apps", value: "4" },
  { label: "Stack", value: "Cloudflare" },
  { label: "Mode", value: "Public" },
  { label: "Status", value: "Operational" },
];
