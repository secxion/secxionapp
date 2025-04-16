/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cream-white": "#f5f5f1",
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}