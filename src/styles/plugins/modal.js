const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities }) {
  const modal = {
    '.modal-styling': {
      borderRadius: '0.25rem',
      width: '100%',
      height: 'fit-content',
      position: 'relative',
      zIndex: 30,
      backgroundColor: '#FFF',
      boxShadow:
        '0 1px 1px #00000004, 0 2px 4px #00000006, 0 3px 6px #0000000d, 0 4px 8px #00000013, 0 5px 10px #0000001a',
      margin: '4px',
    },
    '@media (min-width: 768px)': {
      '.modal-styling': {
        width: '598px',
        top: '10%',
      },
    },
    '@media (min-width: 992px)': {
      '.modal-styling': {
        top: '15%',
      },
    },
  }
  addUtilities(modal)
})
