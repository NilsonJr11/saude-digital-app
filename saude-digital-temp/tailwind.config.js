/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D9488",   // O verde que você quer
        secondary: "#1E293B", // O azul escuro
        accent: "#CCFBF1",
      },
    },
  },
  plugins: [],
}