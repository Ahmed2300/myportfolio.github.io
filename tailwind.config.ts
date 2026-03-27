import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f4f9fc",
          100: "#e6f2fa",
          200: "#c5e4f7",
          300: "#9CD5FF",
          400: "#8bc4ee",
          500: "#7AAACE",
          600: "#5b8cae",
          700: "#446e8e",
          800: "#355872",
          900: "#274459",
          950: "#182b3a",
        },
        slate: {
          50: "#F7F8F0",
          100: "#eef0e6",
          200: "#dce0d1",
          300: "#c1c9b6",
          400: "#9eb0a4",
          500: "#7f9693",
          600: "#60797b",
          700: "#4a6064",
          800: "#355872",
          900: "#223c50",
          950: "#132433",
        },
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
