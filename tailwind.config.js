const modalPlugin = require('./src/styles/plugins/modal.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#9f5fd4',
        'primary-light': '#b784e0',
        'primary-dark': '#722cab',
        gray: {
          'dark-opacity': '#1d1e1cb3',
          dark: '#1d1e1c',
          light: 'rgba(29,30,28,.07)',
          modal: 'rgba(29,30,28,.62)',
          border: 'rgba(29,30,28,.3)',
        },
      },
      borderRadius: {
        base: '0.25rem',
      },
      leading: {
        5.6: '1.4',
      },
      fontSize: {
        xxs: '0.625rem',
        13: '0.8125rem',
        15: '0.938rem',
        '2.5xl': '1.563rem' /* 25px */,
        gargantuar: '6rem',
      },
      margin: {
        13: '3.25rem',
      },
      padding: {
        1.5: '0.375rem',
      },
      height: {
        13: '3.25rem',
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
  plugins: [modalPlugin],
}
