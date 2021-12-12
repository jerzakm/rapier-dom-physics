module.exports = {
  purge: ["./src/**/*.{ts,html}", "./dist/*.{html,js,ts}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
