/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#A07830',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          2: '#111111',
          3: '#1A1A1A',
          4: '#222222',
          5: '#2A2A2A',
        },
        'off-white': '#F5F0E8',
        muted: '#8A8A8A',
      },
    },
  },
  plugins: [],
};
