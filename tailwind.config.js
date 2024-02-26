/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          light: 'hsl(var(--foreground-light))',
          lighter: 'hsl(var(--foreground-lighter))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          alternative: 'hsl(var(--card-alternative))',
          hover: 'hsl(var(--card-hover))',
        },
      },
    },
  },
  plugins: [],
}
