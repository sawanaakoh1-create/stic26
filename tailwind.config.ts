import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /**
         * Palette « Terre & Voix » — inspirée du crépuscule ouest-africain :
         * savane, terre cuite, ocre, or.
         * Les noms `navy` et `sky` sont conservés pour compatibilité mais
         * pointent désormais vers des tons chauds (nuit africaine + terracotta).
         */
        navy: {
          950: "#0d0705", // nuit profonde
          900: "#160d0a",
          800: "#20150f",
          700: "#2c1e17",
          600: "#3a2a20",
        },
        sky: {
          50: "#fdf6ec", // crème
          100: "#fbe6c8",
          200: "#f7cd97",
          300: "#f2ad6b", // ambre chaud (accent principal clair)
          400: "#e88a4a", // terre cuite (accent principal)
          500: "#c8632a", // terre cuite profonde
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px 0 rgba(232, 138, 74, 0.30)",
        "glow-lg": "0 0 120px 0 rgba(232, 138, 74, 0.35)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-ring": "pulseRing 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
