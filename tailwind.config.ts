import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        clay: {
          DEFAULT: "#8B4513",
          50: "#FBEFE5",
          100: "#F2D8BF",
          200: "#E5B289",
          300: "#D88A53",
          400: "#B6661F",
          500: "#8B4513",
          600: "#723812",
          700: "#562A0E",
          800: "#3D1E0A",
          900: "#241105",
        },
        charcoal: {
          DEFAULT: "#1C2833",
          50: "#E8EAEC",
          100: "#C5CCD2",
          200: "#9AA5AF",
          300: "#6F7E8C",
          400: "#475663",
          500: "#1C2833",
          600: "#172029",
          700: "#11181F",
          800: "#0B1014",
          900: "#06080A",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          50: "#FFFFFF",
          100: "#FBF8F3",
          200: "#F5F0E8",
          300: "#E6DCC9",
          400: "#D7C8AB",
          500: "#C4AF85",
        },
        brass: {
          DEFAULT: "#C67B30",
          50: "#FAEEDD",
          100: "#F2D5B0",
          200: "#E6B47A",
          300: "#D89549",
          400: "#C67B30",
          500: "#A86727",
          600: "#85521F",
          700: "#623D17",
        },
        verified: "#2E7D32",
        busy: "#B71C1C",
      },
      fontFamily: {
        heading: ["var(--font-cairo)", "system-ui", "sans-serif"],
        body: [
          "var(--font-plex)",
          "var(--font-cairo)",
          "system-ui",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "geometric-light":
          "radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.08) 1px, transparent 0)",
      },
      backgroundSize: {
        dot: "20px 20px",
      },
    },
  },
  plugins: [],
};

export default config;
