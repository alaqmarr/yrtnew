import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          yellow: "#F59E0B",
          yellowLight: "#FEF3C7",
          gold: "#EAB308",
          cyan: "#06B6D4",
          cyanLight: "#CFFAFE",
          cyanDark: "#0891B2",
          coral: "#F43F5E",
          coralLight: "#FFE4E6",
          green: "#10B981",
          greenLight: "#D1FAE5",
          dark: "#0F172A",
          charcoal: "#1E293B",
          muted: "#64748B",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #F59E0B 0%, #F43F5E 50%, #06B6D4 100%)",
        "brand-rainbow": "linear-gradient(90deg, #F59E0B 0%, #10B981 33%, #06B6D4 66%, #F43F5E 100%)",
        "brand-glow": "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03)",
        "card-hover": "0 20px 35px -5px rgba(15, 23, 42, 0.1), 0 10px 15px -5px rgba(245, 158, 11, 0.15)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        cursive: ["var(--font-cursive)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
