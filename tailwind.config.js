/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // SpaceSist deep-space palette
        bg: "#06070f",
        surface: "#0c0e1a",
        surface2: "#111326",
        surface3: "#171930",
        border: "#1e2140",
        borderBright: "#2d3260",
        ink: "#e4e6f5",
        muted: "#7a7e9a",
        faint: "#3d4060",
        accent: "#c5a352",
        accentDim: "rgba(197,163,82,0.19)",
        // Data accent colors
        blue: "#4a8fd4",
        red: "#e05555",
        green: "#4ec994",
        purple: "#9b6cf0",
        orange: "#f0934a",
        teal: "#4acfc9",
        yellow: "#f0d44a",
      },
      fontFamily: {
        display: ['Zodiak', 'Georgia', 'serif'],
        sans: ['"Cabinet Grotesk"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "16px",
        xl: "20px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
