/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  // don't purge bg and border colors
  safelist: [{ pattern: /^bg-.*/ }, { pattern: /^border-.*/ }],

  theme: {
    extend: {},
  },
  // TODO: unknown what this was used for
  // variants: {
  //   extend: {
  //     opacity: ['disabled'],
  //   },
  // },
  plugins: [],
}
