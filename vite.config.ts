import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the path module
import tailwindcss from "@tailwindcss/vite";
// Helper function for resolving paths - modern approach recommended by Vite
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Map the '@' symbol to the absolute path of the 'src' directory
      '@': path.resolve(__dirname, './src'),
      // If you specifically wanted to map "@/*" to the lib folder
      // within src, and had tsconfig paths like "@/lib/*": ["lib/*"],
      // you might use:
      // "@/lib": path.resolve(__dirname, './src/lib')
      // But given your tsconfig maps "@/*" to "src/*" relative to baseUrl=./src,
      // mapping "@" to "./src" is the correct match.
    },
  },
});