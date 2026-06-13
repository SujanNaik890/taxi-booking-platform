/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4AF37',       // Metallic Gold
          charcoal: '#131A26',   // Deep Navy Charcoal
          dark: '#0A0D14',       // Midnight Obsidian
          card: '#172030',       // Executive Slate Card
          accent: '#FFDF00',     // Accent Gold
          muted: '#94A3B8',      // Slate Muted
          light: '#F1F5F9'       // Soft Light Gray
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
