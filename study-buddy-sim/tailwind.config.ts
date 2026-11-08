import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1368px",
      },
    },
    extend: {
      fontFamily: {
        ibm: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        amin: ['"Amin"', 'sans-serif'],
        viphala: ['"VIPHALA"', 'sans-serif'],
        somar: ['"Somar"', 'sans-serif'],
        aref: ['"Aref Ruqaa Ink"', '"Aref Ruqaa"', 'serif'],
        almarai: ['"Almarai"', 'sans-serif'],
        cairo: ['"Cairo"', 'sans-serif'],
        heading: ['"IBM Plex Sans Arabic"', '"Amin"', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', '"Almarai"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        elameed: {
          primary: "var(--primary)",
          hover: "var(--primary-hover)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          dark: "var(--dark)",
          gray: "var(--gray)",
          section: "var(--section-bg)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        8: "8px",
        12: "12px",
        16: "16px",
        20: "20px",
        24: "24px",
        32: "32px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
