import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: '404.html',
      precompress: true,
      strict: false
    }),
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    },
    alias: {
      '$lib': './src/lib',
      '$components': './src/lib/components',
      '$data': './src/lib/data',
      '$utils': './src/lib/utils',
      '$types': './src/lib/types',
      '$assets': './static'
    }
  }
};

export default config;
