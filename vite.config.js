import { defineConfig } from 'vite';

// The app lives in `frontend/` and is deployed to https://community.algolia.com/diag/
// (a sub-path), so we build with relative asset URLs into `public/` which the
// `deploy` script pushes to gh-pages.
export default defineConfig({
  root: 'frontend',
  base: './',
  // Files that must be copied verbatim (boomerang vendor script + the images it
  // fetches at runtime by a URL it builds itself, so Vite can't discover them).
  publicDir: 'static',
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
});
