/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        board: "#21302B",
        chalk: "#F0C94E",
        ink: "#223047",
      },
    },
  },
  plugins: [],
};
