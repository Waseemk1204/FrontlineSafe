export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B0B0B',
          dark: '#000000',
        },
        accent: {
          DEFAULT: '#FFD400',
          dark: '#E6BF00',
        },
        neutral: {
          50: '#F4F4F4',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#767676',
          600: '#5C5C5C',
          700: '#2E2E2E',
          800: '#1F1F1F',
          900: '#0B0B0B',
        },
        success: '#16A34A',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        base: '16px',
        h1: '28px',
        h2: '22px',
        h3: '18px',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
      },
      borderRadius: {
        card: '8px',
        button: '6px',
        input: '4px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
    },
  },
  plugins: [],
}