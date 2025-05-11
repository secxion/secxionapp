/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glowLine: {
        '0%, 100%': { borderColor: '#0ff' },
        '25%': { borderColor: '#0f0' },
        '50%': { borderColor: '#f0f' },
        '75%': { borderColor: '#f00' },
      },
    animation: {
      glowLine: 'glowLine 3s infinite ease-in-out',
    },
        neon: {
          '0%, 100%': { textShadow: '0 0 10px #00f, 0 0 20px #0ff' },
          '25%': { textShadow: '0 0 10px #0f0, 0 0 20px #0ff' },
          '50%': { textShadow: '0 0 10px #f0f, 0 0 20px #ff0' },
          '75%': { textShadow: '0 0 10px #f00, 0 0 20px #0ff' },
        },
      },
      animation: {
        neon: 'neon 4s infinite ease-in-out',
      },
      boxShadow: {
        neon: '0 0 10px rgba(255, 255, 255, 0.6)',
      },
      screens: {
        'xxs': '320px',
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        primary: 'white',
        'primary-dark': '#fff',
        secondary: 'black',
        'secondary-dark': '#000',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        'body': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};