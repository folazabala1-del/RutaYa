/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1530',
          900: '#0F1B3D',
          800: '#16234B',
          700: '#1D2E5C',
        },
        amber: {
          400: '#F5A623',
          500: '#EE9315',
          600: '#D67F0A',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(15, 27, 61, 0.08)',
      },
    },
  },
  plugins: [],
}
