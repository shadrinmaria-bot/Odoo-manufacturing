/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0e1a',
          800: '#0f1628',
          700: '#141c34',
          600: '#1a2340',
          500: '#1e2a4a',
        },
      },
    },
  },
  plugins: [],
}
