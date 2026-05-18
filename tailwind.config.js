export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'matrix-black': '#0a0f0f',
        'cyber-white': '#e0f2fe',
        'neon-green': '#00ff9d',
        'neon-red': '#ff3366',
        'glass-bg': 'rgba(10, 15, 15, 0.7)',
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};