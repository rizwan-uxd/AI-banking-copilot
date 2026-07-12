/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--color-surface-elevated) / <alpha-value>)",
        "surface-muted": "rgb(var(--color-surface-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-muted": "rgb(var(--color-accent-muted) / <alpha-value>)",
        navy: "rgb(var(--color-navy) / <alpha-value>)",
        "on-accent": "rgb(var(--color-on-accent) / <alpha-value>)",
        positive: "rgb(var(--color-positive) / <alpha-value>)",
        negative: "rgb(var(--color-negative) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
      },
      fontSize: {
        display: ["36px", { lineHeight: "43px" }],
        title: ["28px", { lineHeight: "34px" }],
        heading: ["22px", { lineHeight: "28px" }],
        body: ["16px", { lineHeight: "24px" }],
        caption: ["12px", { lineHeight: "16px" }],
        mono: ["16px", { lineHeight: "24px" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      fontFamily: {
        sans: ["Geist_400Regular"],
        "sans-medium": ["Geist_500Medium"],
        "sans-semibold": ["Geist_600SemiBold"],
        "sans-bold": ["Geist_700Bold"],
        mono: ["GeistMono_400Regular"],
        "mono-medium": ["GeistMono_500Medium"],
      },
    },
  },
  plugins: [],
};
