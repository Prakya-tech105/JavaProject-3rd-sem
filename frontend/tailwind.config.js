/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          100: '#C4E8C2',
          200: '#AECFA4',
          300: '#6BBD99',
          400: '#46A094',
          500: '#358a7e', // slightly darker derivative for hover if needed
        },
        dark: {
          bg: '#121418',       // Darker background for contrast
          sidebar: '#1a1d23',  // Slightly lighter sidebar
          card: '#22262e',     // Card background
        }
      }
    },
  },
  plugins: [],
}
