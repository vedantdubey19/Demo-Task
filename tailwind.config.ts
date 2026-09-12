import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#08080C",
        "bg-2": "#0E0E14",
        surface: "#14141E",
        "surface-2": "#1B1B28",
        "surface-3": "#232334",
        gold: "#F59E0B",
        "gold-accent": "#D4AF6A",
        ice: "#38BDF8",
        success: "#10B981",
        muted: "#9494A3",
        "muted-2": "#616172",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
