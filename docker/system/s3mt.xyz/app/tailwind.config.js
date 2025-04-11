const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Exo 2"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#8B5CF6', // Purple
          dark: '#7C3AED'
        },
        secondary: {
          DEFAULT: '#2DD4BF', // Teal
          dark: '#14B8A6'
        },
        accent: {
          DEFAULT: '#06B6D4', // Turquoise
          dark: '#0891B2'
        }
      }
    }
  }
}