import { theme as _theme } from './askanna.conf.json'

/** @type {import('tailwindcss').Config} */
export const important = true
export const corePlugins = {
  preflight: false,
  backdropFilter: false
}
export const safelist = [
  {
    pattern: /on-surface/
  },
  {
    pattern: /outline-(primary|secondary|third|accent|error|info|success|warning|failed|main)/
  }
]
export const content = ['./index.html', './src/**/*.{vue,js,ts}']
export const theme = {
  extend: {
    minWidth: {
      '72': '18rem'
    },
    fontSize: {
      '2xl': [
        '1.4rem',
        {
          lineHeight: '2rem',
          letterSpacing: '-0.01em',
          fontWeight: '500'
        }
      ]
    },
    width: {
      '1.1/3': '36.6%'
    },
    typography: {
      DEFAULT: {
        css: {
          color: _theme.colors['main'],
          'h1, h2, h3, h4, h5, h6': {
            color: _theme.colors['main']
          },
          a: {
            color: _theme.colors.primary
          },
          'ul > li::marker': {
            color: _theme.colors['main']
          },
          'ol > li::marker': {
            color: _theme.colors['main']
          }
        }
      }
    },
    height: {
      7.5: '30px'
    },
    colors: _theme.colors
  }
}
export const plugins = [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
