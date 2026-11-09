/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        paper: {
          DEFAULT: '#e8e7e3',
          2: '#dddbd6',
          3: '#d2d0cb',
        },
        ink: {
          DEFAULT: '#1c1c1a',
          soft: '#4a4a46',
          muted: '#8a8a84',
          faint: '#b3b2ac',
        },
        line: '#d0cec8',
        card: {
          DEFAULT: '#1c1c1c',
          mid: '#2b2b2b',
        },
        snow: '#f4f3ef',
      },
      borderRadius: {
        atmos: '28px',
      },
      boxShadow: {
        atmos: '0 24px 50px -28px rgba(28, 28, 26, 0.45)',
      },
    },
  },
  plugins: [],
}
