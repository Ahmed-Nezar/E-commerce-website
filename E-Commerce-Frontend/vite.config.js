import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path          from 'path';

export default defineConfig({
  // Point Vite at the monorepo root
  envDir: path.resolve(__dirname, '../'),
  plugins: [react()],
  server: {
    allowedHosts: [
      'crossing-motivation-regulations-monster.trycloudflare.com'
    ]
  }
});
