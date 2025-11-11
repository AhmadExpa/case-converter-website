/**
 * PostCSS configuration for Tailwind CSS.
 *
 * This configuration simply wires up Tailwind and Autoprefixer. When
 * you run `npm run build` this file will be consumed to generate
 * the final CSS bundle.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};