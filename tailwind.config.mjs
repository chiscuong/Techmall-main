/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        p: {
          50:  "#f5f7f9",
          100: "#e7edf2",
          200: "#d5dfe8",
          300: "#b7cad9",
          400: "#95afc5",
          500: "#7b96b6",
          600: "#6b83a8",
          700: "#5d7298",
          800: "#505e7d",
          900: "#434f65",
          950: "#2c323f",
        },
        sc: {
          50:  "#f9f6f9",
          100: "#f5eef5",
          200: "#eddded",
          300: "#dfc2df",
          400: "#cb9bc9",
          500: "#b87cb4",
          600: "#a86ba1",
          700: "#894d80",
          800: "#72426a",
          900: "#613a5b",
          950: "#391e35",
        },
        neu: {
          50:  "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5dc",
          400: "#99a1af",
          500: "#6a7282",
          600: "#4a5565",
          700: "#364153",
          800: "#1e2939",
          900: "#101828",
          950: "#030712",
        },
      },
      
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".underline-center": {
          position: "relative",
          "&::after": {
            content: "''",
            position: "absolute",
            left: "50%",
            bottom: "0",
            height: "2px",
            width: "0",
            backgroundColor: "currentColor",
            transition: "all 0.3s ease",
          },
          "&:hover::after": {
            left: "0",
            width: "100%",
          },
        },
      });
    }),
  ],
};
