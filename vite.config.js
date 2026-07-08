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
    // Explicit browser floor (kept in sync with `browserslist` in package.json).
    // This is the knob Vite/esbuild actually enforces — Vite does not read
    // browserslist. CSS features in use (flexbox `gap`, the `inset` shorthand)
    // additionally require Safari 14.1, which the browserslist reflects.
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
    outDir: '../public',
    emptyOutDir: true,
  },
});
