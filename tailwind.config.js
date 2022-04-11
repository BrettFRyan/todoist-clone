module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      transitionProperty: {
        spacing: "margin, padding",
        height: "height",
      },
    },
  },
  plugins: [],
};
