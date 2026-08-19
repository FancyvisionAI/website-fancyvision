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
        bg: "var(--color-bg)",
        ink: "var(--color-ink)",
        canvas: "var(--color-canvas)",
        accent: "var(--color-accent)",
        lime: "var(--color-lime)",
        cobalt: "var(--color-cobalt)",
        "cobalt-strong": "var(--color-cobalt-strong)",
        brand: "var(--color-brand)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
      },
      borderRadius: {
        control: "8px",
        card: "14px",
        pill: "999px",
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        display: ["var(--font-sora)", "Arial", "sans-serif"],
        serif: ["Noto Serif", "Georgia", "serif"],
        mono: ["Geist Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(24,24,20,.10)",
        card: "var(--shadow-soft)",
      },
    },
  },
  plugins: [],
};

export default config;
