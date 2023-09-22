module.exports = {
  $schema: 'https://json.schemastore.org/prettierrc',
  tabWidth: 2,
  printWidth: 120,
  semi: false,
  trailingComma: 'none',
  singleQuote: true,
  endOfLine: 'auto',
  arrowParens: 'avoid',
  plugins: [require('prettier-plugin-tailwindcss')]
}
