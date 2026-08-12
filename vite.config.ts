import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname || '.', './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // Lets you open the dev server through an ngrok tunnel — Vite blocks
    // unrecognized Host headers by default. Leading dot = all subdomains.
    allowedHosts: ['.ngrok-free.app'],
  },
});
