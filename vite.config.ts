import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    // React Compiler requires React versions that export `react/compiler-runtime`.
    // Keep it opt-in so production builds (e.g. Vercel) don't break on React 18.
    react(
      process.env.REACT_COMPILER === 'true'
        ? {
            babel: {
              plugins: [['babel-plugin-react-compiler']],
            },
          }
        : undefined,
    ),
  ],
})
