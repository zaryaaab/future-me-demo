import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        accent: {
          50: "#f2f0fe",
          100: "#e1ddfd",
          200: "#c7bffb",
          400: "#8b7cf6",
          500: "#6c5ce7",
          600: "#5b4bd1",
          700: "#4a3ba8",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
