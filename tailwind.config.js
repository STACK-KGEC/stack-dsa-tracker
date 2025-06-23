module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Indigo-600
          dark: '#60a5fa',    // Blue-400
        },
        secondary: {
          DEFAULT: '#0ea5e9', // Cyan-500
          dark: '#67e8f9',    // Cyan-300
        },
        background: {
          light: '#f1f5f9',   // Slate-100
          dark: '#1e293b',    // Slate-800
        },
        surface: {
          light: '#fff',
          dark: '#334155',    // Slate-700
        },
        text: {
          light: '#1e293b',   // Slate-800
          dark: '#f1f5f9',    // Slate-100
        },
        muted: {
          light: '#64748b',   // Slate-400
          dark: '#94a3b8',    // Slate-300
        },
        accent: {
          DEFAULT: '#f59e42', // Orange-400
          dark: '#fbbf24',    // Yellow-400
        },
      },
    },
  },
  plugins: [],
}
