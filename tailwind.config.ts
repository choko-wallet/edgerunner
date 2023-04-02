import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blur: {
          '0%': { filter: "blur(0px)" },
          '100%': { filter: "blur(5px)" },
        }
      },
      animation: {
        blur: 'blur 2s linear infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;
