import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      //================shadows===================
      boxShadow: {
        centralPanelShadow: "var(--central-panel-shadow)",
        inputShadow: "var(--input-shadow)",
      },
      dropShadow: {
        textShadow: "var(--text-shadow)",
      },

      //==================backgrounds====================
      backgroundImage: {
        "body-gradient": "var(--body-gradient)",
        "central-panel-gradient": "var(--central-panel-gradient)",
      },

      //================colors===================
      colors: {
        background: "var(--background)",
        background2: "var(--background2)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
