/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  corePlugins: {
    preflight: false,
    backdropFilter: false
  },
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#5D3EB2',
        secondary: '#515151',
        accent: '#82B1FF',
        error: '#FF7872',
        info: '#FAED7A',
        success: '#49B0AD',
        warning: '#FFC107',
        failed: '#FF6F00'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
