/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        hover: "#FFAAAA",
        card: "#41444B",
        cardWhite: "#DFD8C8",
        invalid: "#b3b3b3",
        bgLight: "#F2F1EB",
        bgDark: "#323232",
        primary: "#DF8E92",
        "primary-light": "#FF8080",
        "primary-dark": "#E97777",
        secondary: "#ACE1AF",
        "secondary-light": "#B0EBB4",
        "secondary-dark": "#95D2B3",
        highlight: "#FFBCBC",
      },
    },
  },
  plugins: [],
};
