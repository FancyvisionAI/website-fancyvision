import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        canvas: "var(--color-canvas)",
        accent: "var(--color-accent)",
        lime: "var(--color-lime)",
        cobalt: "var(--color-cobalt)",
        muted: "var(--color-muted)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["Figtree", "Arial", "sans-serif"],
        display: ["Figtree", "Arial", "sans-serif"],
        serif: ["Noto Serif", "Georgia", "serif"],
        mono: ["Geist Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(24,24,20,.10)",
      },
    },
  },
  plugins: [],
};

export default config;
