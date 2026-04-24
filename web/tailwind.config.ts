import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-1": "var(--bg-1)",
        "bg-2": "var(--bg-2)",
        "bg-3": "var(--bg-3)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        fg: "var(--fg)",
        "fg-dim": "var(--fg-dim)",
        "fg-mute": "var(--fg-mute)",
        "fg-faint": "var(--fg-faint)",
        accent: "var(--accent)",
        "accent-weak": "var(--accent-weak)",
        warn: "var(--warn)",
        danger: "var(--danger)",
        ok: "var(--ok)",
        info: "var(--info)",
      },
      fontFamily: {
        "inter-tight": ["var(--font-inter-tight)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        cardIn: "cardIn 220ms ease-out",
        pulseSoft: "pulse 1.6s ease-in-out infinite",
        spinSlow: "spin 1s linear infinite",
      },
      borderRadius: {
        shell: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
