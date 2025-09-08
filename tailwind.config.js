/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "system-ui"],
      },
      colors: {
        // 네온 포인트
        neon: {
          50: "#f0f7ff",
          100: "#ddecff",
          200: "#bfe0ff",
          300: "#9bd0ff",
          400: "#6fb8ff",
          500: "#4aa2ff",
          600: "#2b7df2",
          700: "#1e5dbe",
          800: "#1b4ea1",
          900: "#1a448c",
        },
        // 다크 배경 톤
        base: {
          900: "#0b0f16",
          800: "#0f1520",
          700: "#121826",
          600: "#151c2f",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(74,162,255,.35)",
        "inner-neon": "inset 0 1px 0 rgba(255,255,255,.08), 0 0 0 1px rgba(74,162,255,.25)",
      },
      backgroundImage: {
        'grid': "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
