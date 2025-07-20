/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1a2238",
        rosegold: "#b76e79",
        primary: "#3a86ff",
        cyan: "#00bcd4",
        black: "#000000",
      },
    },
  },
  plugins: [],
};
