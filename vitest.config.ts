import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'lcov'],
      all: true,
      exclude: [
        'coverage/**',
        'test{,s}/**',
        'src/index.ts',
        'src/types.ts',
        'src/vite-env.d.ts',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc}.config.{js,cjs,mjs,ts}',
        '**/.{eslint,mocha}rc.{js,cjs}',
      ],
    },

  },
})
