import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@radix-ui/react-icons']
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
});