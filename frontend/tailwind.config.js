/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazir', 'sans-serif'],
        'iran-yekan': ['IRANYekan', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        persian: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#fddcff',
          300: '#fcbfff',
          400: '#f993ff',
          500: '#f358ff',
          600: '#e929ff',
          700: '#d014eb',
          800: '#a811be',
          900: '#8b1199',
        }
      },
      boxShadow: {
        'persian': '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}