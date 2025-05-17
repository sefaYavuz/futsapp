/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa', // Blue 400
          DEFAULT: '#2563eb', // Blue 600
          dark: '#1d4ed8', // Blue 700
        },
        secondary: {
          light: '#2dd4bf', // Teal 400
          DEFAULT: '#14b8a6', // Teal 500
          dark: '#0f766e', // Teal 700
        },
        accent: {
          light: '#f472b6', // Pink 400
          DEFAULT: '#ec4899', // Pink 500
          dark: '#db2777', // Pink 600
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          400: '#94a3b8',
          500: '#64748b',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}; 