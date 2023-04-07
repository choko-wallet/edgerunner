import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "landing-bg": "url('../../public/bg.jpg')",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        // josefin: ['Josefin Sans', 'sans-serif'],
        kanit: ["Kanit", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
        sso: ["Saira Stencil One", "sans-serif"],
        stick: ["Stick", "sans-serif"],
        vt323: ["VT323", "sans-serif"],
      },
      keyframes: {
        blur: {
          "0%": { filter: "blur(0px)" },
          "100%": { filter: "blur(5px)" },
        },
      },
      animation: {
        blur: "blur 2s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
