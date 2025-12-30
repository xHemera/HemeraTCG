/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./script.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#06080F',
          900: '#0A0E1A',
          800: '#111827',
          700: '#1F2937',
          600: '#374151'
        },
        accent: {
          600: '#6D28D9',
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD'
        },
        cyan: {
          500: '#06B6D4',
          400: '#22D3EE',
          300: '#67E8F9'
        }
      },
      boxShadow: {
        glow: '0 0 24px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.3)',
        neon: '0 0 20px rgba(34, 211, 238, 0.4)'
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
