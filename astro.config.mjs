import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://bayu-portfolio.vercel.app',
  vite: {
    ssr: {
      noExternal: ['three', 'gsap']
    }
  }
});
