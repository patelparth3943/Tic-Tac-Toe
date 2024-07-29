/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg': '#5c5470',
        'custom-box-bg': ' #352f44',
        'custom-box-text': '#dbd8e3',
        'custom-btn-bg': ' #dbd8e3',
      },
      spacing: {
        '18vmin': '18vmin',
        '60vmin': '60vmin',
      },
      fontSize: {
        '8vmin': '8vmin',
        '5vmin': '5vmin',
      },
      boxShadow: {
        'custom': '0 0 1rem rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '1rem': '1rem',
      },
    },
  },
  plugins: [],
}
