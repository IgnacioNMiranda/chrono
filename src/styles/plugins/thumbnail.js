const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities }) {
  const thumbnail = {
    '.thumbnail-styling': {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '90px',
      height: '90px',
      zIndex: '20',
      display: 'none',
    },
    '@media (min-width: 640px)': {
      '.thumbnail-styling': {
        display: 'block',
      },
    },
    '@media (min-width: 1300px)': {
      '.thumbnail-styling': {
        width: '130px',
        height: '130px',
      },
    },
    '@media (min-width: 1450px)': {
      '.thumbnail-styling': {
        width: '200px',
        height: '200px',
      },
    },
  }
  addUtilities(thumbnail)
})
