/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#328cff',
          600: '#1b6cf5',
          700: '#1656e0',
          800: '#1846b5',
          900: '#193e8e',
          950: '#142754'
        },
        teal: {
          500: '#14b8a6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 2px 10px rgba(20, 40, 90, 0.06)',
        cardHover: '0 8px 24px rgba(20, 40, 90, 0.12)'
      }
    }
  },
  plugins: []
};
