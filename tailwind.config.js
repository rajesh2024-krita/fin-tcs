
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e5edff',
          200: '#d0ddff',
          300: '#b4c2ff',
          400: '#9199ff',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
        },
        secondary: {
          50: '#fef7ff',
          100: '#fdf2ff',
          200: '#fce7ff',
          300: '#f9d0ff',
          400: '#f3a8ff',
          500: '#e879f9',
          600: '#d946ef',
          700: '#c026d3',
          800: '#a21caf',
          900: '#86198f',
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-dark-primary': 'linear-gradient(135deg, #06ffa5 0%, #00d4ff 100%)',
        'gradient-dark-secondary': 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
        'gradient-light-bg': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'gradient-dark-bg': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'gradient-sidebar-light': 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        'gradient-sidebar-dark': 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient-shift 4s ease infinite',
        'slide-in': 'slideIn 0.5s ease forwards',
        'fade-in': 'fadeIn 0.6s ease',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'gradient': '0 10px 40px rgba(102, 126, 234, 0.3)',
        'dark-gradient': '0 10px 40px rgba(6, 255, 165, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
