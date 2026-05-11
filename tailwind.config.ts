import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fff7f8",
        ink: "#33242b",
        clay: "#c85f79",
        moss: "#667a68",
        honey: "#d7a85a",
        cream: "#ffffff",
        blush: "#fde8ed",
        plum: "#5a2f43"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(48, 37, 28, 0.12)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Cooper Black", "Segoe UI Rounded", "Arial Rounded MT Bold", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;





