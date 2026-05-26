import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'abyss-ink':   '#03060f',
        'abyss-deep':  '#060c1c',
        'abyss':       '#0a1730',
        'abyss-soft':  '#102245',
        'midnight':    '#1a2f5c',
        'twilight':    '#2c4a82',
        'shoal':       '#5b82b8',
        'mist':        '#b6c8df',
        'foam':        '#eef3fa',
        'surface':     '#f6f4ee',
        'vellum':      '#ece6d6',
        'lumen':       '#4afdc6',
        'lumen-bright':'#c6ffe6',
        'lumen-core':  '#00ffc4',
        'lumen-deep':  '#1f7d62',
        'lumen-ink':   '#052a23',
        'krill':       '#ffb472',
        'krill-deep':  '#c4793a',
        'coral':       '#ff6b54',
      },
      fontFamily: {
        display: ['Newsreader', 'Times New Roman', 'serif'],
        body:    ['Spectral', 'Georgia', 'Times New Roman', 'serif'],
        sans:    ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
