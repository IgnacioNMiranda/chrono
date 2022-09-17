const modalPlugin = require('./src/styles/plugins/modal.js')
const scrollbarHidePlugin = require('./src/styles/plugins/scrollbar-hide.js')
const thumbnailPlugin = require('./src/styles/plugins/thumbnail.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        warning: {
          DEFAULT: '#d92f2f',
          dark: '#be2923',
        },
        info: {
          DEFAULT: '#2a59c1',
        },
        alert: {
          DEFAULT: '#ffc33c',
          light: '#fff1cd',
          dark: '#d99c22',
        },
        primary: {
          DEFAULT: '#9f5fd4',
          light: '#b784e0',
          lighter: '#ead7fa',
          dark: '#722cab',
        },
        gray: {
          'dark-opacity': '#1d1e1cb3',
          dark: '#1d1e1c',
          medium: '#4a4b49',
          light: 'rgba(29,30,28,.07)',
          modal: 'rgba(29,30,28,.62)',
          border: 'rgba(29,30,28,.3)',
          'divider-border': '#bbb',
        },
        secondary: {
          light: '#FFF8F1',
        },
        green: {
          light: '#daefdc',
          dark: '#76bc82',
        },
        red: {
          light: '#FCA5A5',
          dark: '#B91C1C',
        },
      },
      borderRadius: {
        base: '0.25rem',
        lgxl: '0.625rem',
      },
      leading: {
        5.6: '1.4',
      },
      fontSize: {
        xxs: '0.625rem',
        13: '0.8125rem',
        15: '0.938rem',
        17: '1.063rem',
        '2.5xl': '1.563rem' /* 25px */,
        30: '1.875rem',
        gargantuar: '6rem',
      },
      margin: {
        13: '3.25rem',
      },
      padding: {
        2.5: '0.625rem',
        1.5: '0.375rem',
        3.752: '0.938rem',
      },
      height: {
        13: '3.25rem',
      },
      width: {
        15: '3.75rem',
        '1/7': '14.285714285714285714285714285714%',
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
  plugins: [modalPlugin, scrollbarHidePlugin, thumbnailPlugin],
}
