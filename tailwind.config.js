/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
          border: "#334155",
        },
        brand: {
          DEFAULT: "#e11d48",
          dark: "#be123c",
        },
        cream: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
        },
        intervention: "#f59e0b",
      },
    },
  },
  plugins: [],
};
