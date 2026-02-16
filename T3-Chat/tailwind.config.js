/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 0 20px rgba(255, 255, 255, 0.5)',
        'neumorphic': '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
        'neumorphic-inset': 'inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}