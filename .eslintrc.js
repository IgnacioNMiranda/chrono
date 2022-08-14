module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@next/next/no-html-link-for-pages': ['off'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
