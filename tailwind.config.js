/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#9f5fd4',
        'primary-light': '#b784e0',
        'primary-dark': '#722cab',
      },
      fontSize: {
        xxs: '0.625rem',
        gargantuar: '6rem',
      },
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1216px',
      // => @media (min-width: 1216px) { ... }
    },
  },
  plugins: [],
}
