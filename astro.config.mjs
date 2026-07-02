import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://Leolib87.github.io',
  base: '/programas-posgrado-nacional',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 8500,
  },
});
