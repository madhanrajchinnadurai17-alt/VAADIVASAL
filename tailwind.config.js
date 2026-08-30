/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tamil: {
          saffron: "#F26A1B",
          marigold: "#FFA000",
          terracotta: "#C84B31",
          earth: "#2D1B16",
          sand: "#EAD6B8",
          darkSand: "#CBB394",
          crimson: "#8B0000",
          gold: "#FFD700",
          night: "#120B09",
          brass: "#B8860B",
          forest: "#1E4620"
        }
      },
      fontFamily: {
        tamil: ["'Mukta Malar'", "'Latha'", "sans-serif"],
        display: ["'Cinzel'", "'Georgia'", "serif"]
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        dustFloat: {
          '0%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.6' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'dust-float': 'dustFloat 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
