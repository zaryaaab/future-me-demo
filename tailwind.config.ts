import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#0a0612",
          900: "#120a20",
          800: "#1c1030",
          700: "#2a1846",
          600: "#3a2260",
        },
        neon: {
          pink: "#ff2f92",
          orange: "#ff7a45",
          purple: "#a855f7",
          purpledeep: "#6d28d9",
          gold: "#ffb347",
        },
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #ff2f92 0%, #ff7a45 45%, #a855f7 100%)",
        "neon-gradient-vertical": "linear-gradient(180deg, #ff2f92 0%, #ff7a45 45%, #a855f7 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(255, 47, 146, 0.45), 0 0 40px rgba(168, 85, 247, 0.25)",
        "neon-sm": "0 0 12px rgba(255, 47, 146, 0.35)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out",
        glowPulse: "glowPulse 2.4s ease-in-out infinite",
        scanline: "scanline 2.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
