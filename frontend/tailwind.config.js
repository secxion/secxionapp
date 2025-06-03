/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
        '2xl': '1536px',
      },
    },
    extend: {
      keyframes: {
        slideFadeIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideFadeOut: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-20px)' },
        },
        glowLine: {
          '0%, 100%': { borderColor: '#0ff' },
          '25%': { borderColor: '#0f0' },
          '50%': { borderColor: '#f0f' },
          '75%': { borderColor: '#f00' },
        },
        neon1: {
          '0%, 100%': { textShadow: '0 0 10px #00f, 0 0 20px #0ff' },
          '50%': { textShadow: '0 0 15px #0ff, 0 0 30px #00f' },
          '25%': { textShadow: '0 0 10px #0f0, 0 0 20px #0ff' },
          '75%': { textShadow: '0 0 10px #f00, 0 0 20px #0ff' },
        },
        neon2: {
          '0%, 100%': { textShadow: '0 0 10px #0f0, 0 0 20px #ff0' },
          '25%': { textShadow: '0 0 10px #0f0, 0 0 20px #0ff' },
          '50%': { textShadow: '0 0 10px #f0f, 0 0 20px #ff0' },
          '75%': { textShadow: '0 0 10px #f00, 0 0 20px #0ff' },
        },
        neon3: {
          '0%, 100%': { textShadow: '0 0 10px #f0f, 0 0 20px #f00' },
          '50%': { textShadow: '0 0 15px #f00, 0 0 30px #f0f' },
        },
        neon4: {
          '0%, 100%': { textShadow: '0 0 10px #0ff, 0 0 20px #fff' },
          '50%': { textShadow: '0 0 15px #fff, 0 0 30px #0ff' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #0ff, 0 0 20px #0ff' },
          '50%': { boxShadow: '0 0 20px #0ff, 0 0 30px #0ff' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 15px #0ff' },
          '50%': { boxShadow: '0 0 25px #0ff' },
        },
      },
      animation: {
        pulseNeon: 'pulseNeon 2s infinite',
        slideFadeIn: 'slideFadeIn 0.4s ease-out forwards',
        slideFadeOut: 'slideFadeOut 0.3s ease-in forwards',
        glowLine: 'glowLine 3s infinite ease-in-out',
        neon1: 'neon1 4s infinite ease-in-out',
        neon2: 'neon2 4s infinite ease-in-out',
        neon3: 'neon3 4s infinite ease-in-out',
        neon4: 'neon4 4s infinite ease-in-out',
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
      },
      boxShadow: {
        neon: '0 0 10px rgba(255, 255, 255, 0.6)',
        neonBlue: '0 0 15px #0ff',
        neonGreen: '0 0 15px #0f0',
        neonPink: '0 0 15px #f0f',
        neonYellow: '0 0 15px #ff0',
        glow: '0 2px 10px rgba(0, 132, 255, 0.25)',
        soft: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05), 0 6px 12px rgba(0, 0, 0, 0.05)',
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
        primary: 'black',
        'primary-dark': '#fff',
        secondary: 'black',
        'secondary-dark': '#000',
        neonBlue: '#0ff',
        neonGreen: '#0f0',
        neonPink: '#f0f',
        neonYellow: '#ff0',
      },
      fontFamily: {
        sans: ['Press Start 2P'],
        serif: ['Press Start 2P'],
        'body': ['Press Start 2P'],
        'techno': ['Press Start 2P'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
