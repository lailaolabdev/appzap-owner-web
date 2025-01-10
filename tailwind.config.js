import theme from './src/theme.js';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      dmd: "992px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      boxShadow: {
        button:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;",
        card: "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        "color-app": theme.primaryColor,
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        noto: ["Noto Sans Lao", "sans-serif"],
        thai: ["Noto Sans Thai", "sans-serif"],
      },
      backgroundImage: {
        "primary-gradient": theme.primaryGradient,
      },
    },
  },
  plugins: [],
};
