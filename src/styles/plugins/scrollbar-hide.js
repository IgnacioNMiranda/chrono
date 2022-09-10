const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities }) {
  const scrollbarHide = {
    '.scrollbar-hide': {
      /* IE and Edge */
      '-ms-overflow-style': 'none',

      /* Firefox */
      'scrollbar-width': 'none',

      /* Safari and Chrome */
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }
  addUtilities(scrollbarHide)
})
