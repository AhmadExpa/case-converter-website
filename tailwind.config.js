/**
 * Tailwind CSS configuration.
 *
 * We enable class-based dark mode so that the site can easily toggle
 * between light and dark themes. This project uses a dark theme by
 * default. The `content` array tells Tailwind where to look for
 * class names so it can generate the appropriate styles. Feel free to
 * extend the theme as needed.
 */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af'
        }
      }
    }
  },
  plugins: []
};