module.exports = {
  purge: ["./src/**/*.{ts,html}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
