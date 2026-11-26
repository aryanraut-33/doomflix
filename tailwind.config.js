/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        doom: {
          950: '#090a0f',
          900: '#10131b',
          850: '#141824',
          800: '#1a1f2e',
          750: '#21273a',
          700: '#2a3148',
          600: '#3d4764',
          border: '#23293b',
          'border-light': '#313950',
          red: '#e21b24',
          'red-dark': '#9e0d14',
          'red-bright': '#ff2a35',
          gold: '#d8a63f',
          'gold-dark': '#b45309',
          emerald: '#10b981',
          'emerald-dark': '#064e3b',
          'emerald-light': '#34d399',
          blue: '#0284c7',
        }
      },
      fontFamily: {
        cinematic: ['"Bebas Neue"', 'sans-serif'],
        marvel: ['"Oswald"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'cinematic': '0 20px 40px -15px rgba(0, 0, 0, 0.9)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.4)',
        'card': '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, transparent 40%, rgba(9, 10, 15, 0.98) 100%)',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      },
      keyframes: {
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "slide-in-up": {
          "from": { opacity: "0", transform: "translateY(16px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "slide-in-up": "slide-in-up 300ms ease-out",
      },
    },
  },
  plugins: [],
}
