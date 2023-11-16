import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true, // allows lazy loading
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  platform: 'browser',
  target: 'es2018',
})
