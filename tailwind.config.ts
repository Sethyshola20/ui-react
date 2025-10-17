import type { Config } from "tailwindcss"

const config: Config = {
  //darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f0d",
        panel: "#111a17",
        accentGreen: "#6fff80",
        accentYellow: "#ffeb75",
        accentRed: "#ff6b6b",
        accentBlue: "#00b8ff",
        textPrimary: "#e4f1e8",
        textSecondary: "#8fa79d",
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        glowGreen: "0 0 8px rgba(111,255,128,0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
