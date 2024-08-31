/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "selector",
  theme: {
    colors: {
      'white': '#ffffff',
      'black': '#000000',
      'hover': '#e7dfff',
      'bgLight': '#F0F0F0',
      'bgDark': '#191825',
      'primary': '#865DFF',
      'primary-light': '#9e7dff',
      'primary-dark': '#6b4acc',
      'secondary': '#E384FF',
      'highlight': '#FFA3FD'
    },
    extend: {},
  },
  plugins: [],
}

