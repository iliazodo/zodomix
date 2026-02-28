import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.ZODOMIX_ENV === 'production' ? 'https://zodomix.com' : 'http://localhost:3030',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
