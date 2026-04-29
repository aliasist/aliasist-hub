/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a1410",
        panel: "#0d1c16",
        panel2: "#13251e",
        border: "#1a2e26",
        ink: "#e8f4ee",
        muted: "#7a9085",
        teal: "#0acb9b",
        tealDim: "#06956e",
        cyan: "#06b6d4",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle at 1px 1px, rgba(10,203,155,0.12) 1px, transparent 0)",
      },
      backgroundSize: {
        dots: "32px 32px",
      },
      boxShadow: {
        teal: "0 0 0 1px rgba(10,203,155,0.25), 0 8px 32px -8px rgba(10,203,155,0.18)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
    },
  },
  plugins: [],
};
