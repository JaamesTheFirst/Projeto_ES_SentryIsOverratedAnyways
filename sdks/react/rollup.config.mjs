import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      name: 'ErrorTrackerReact',
      sourcemap: true,
      exports: 'auto',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      name: 'ErrorTrackerReact',
      sourcemap: true,
      exports: 'auto',
    },
  ],
  external: (id) => {
    // Don't bundle React, ReactDOM, or the JS SDK
    return id === 'react' || id === 'react-dom' || id.startsWith('@error-tracker/js') || id.startsWith('react/');
  },
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
};

