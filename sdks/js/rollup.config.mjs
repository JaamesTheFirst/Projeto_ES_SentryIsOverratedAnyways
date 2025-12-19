import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      name: 'ErrorTracker',
      sourcemap: true,
      exports: 'auto',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      name: 'ErrorTracker',
      sourcemap: true,
      exports: 'auto',
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ErrorTracker',
      sourcemap: true,
      globals: {},
      exports: 'auto',
    },
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
    }),
  ],
  external: [],
};

