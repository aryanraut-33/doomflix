/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        doom: {
          950: '#060709',
          900: '#0a0c10',
          850: '#0f1217',
          800: '#151922',
          750: '#1c222e',
          700: '#252d3d',
          600: '#384358',
          border: '#222838',
          'border-light': '#323b4e',
          red: '#F0141E',
          'red-dark': '#9e0d14',
          'red-bright': '#ff2a35',
          gold: '#f59e0b',
          'gold-dark': '#b45309',
          emerald: '#10b981',
          blue: '#0284c7',
        }
      },
      fontFamily: {
        cinematic: ['"Bebas Neue"', 'sans-serif'],
        marvel: ['"Oswald"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        editorial: ['"Rozha One"', 'serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(240, 20, 30, 0.45)',
        'glow-red-lg': '0 0 50px -10px rgba(240, 20, 30, 0.6)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'cinematic': '0 20px 40px -15px rgba(0, 0, 0, 0.85)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, transparent 40%, rgba(6, 7, 9, 0.95) 100%)',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
