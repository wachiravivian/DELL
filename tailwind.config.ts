import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        olive: { DEFAULT: "#4F6B2B", light: "#5E7D37", dark: "#3F5822", tint: "#EEF2E4" },
        sun: { DEFAULT: "#F28A2E", dark: "#E67A1A", soft: "#F9C98F" },
        bark: { DEFAULT: "#3A2414", muted: "#5A4331", soft: "#6B5644" },
        cream: "#FFFAF2",
        sand: { DEFAULT: "#F6EBD8", deep: "#FBF3E4" },
        line: "#E8DAC2",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        body: ["var(--font-dmsans)", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "1200px" },
                  keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(30px, -24px)" },
        },
        ring: {
          "0%": { transform: "scale(0.6)", opacity: "0.55" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
      },
      animation: {
        float: "float 3.5s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        ring: "ring 3s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;