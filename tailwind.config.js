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
  },
  plugins: [],
}
