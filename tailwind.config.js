/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan for Tailwind classes in all .js, .jsx, .ts, and .tsx files in the src folder
  ],
  theme: {
    screens: {
      sm: "360px",
      // => @media (min-width: 640px) { ... }

      tablet: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 640px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "1xl": "1440px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        colorApp: "#FF6700",
        colorHover: "#ff926a",
        colorGray: "#3D3C3A",
        colorBlack: "#000000",
        colorButton: "#FB6E3B",
        colorWhite: "#FFFFFF",
        colorBorder: "#C51605",
        colorIsStaffConfirm: "#CECE5A",
        colorCallToCheckOut: "#FFE17B",
        colorCallToPayBefore: "#F08080",
        colorEditBill: "#BFFF00",
        colorBerder: "#FB6E3B",
      },
    },
  },
  plugins: [],
};
