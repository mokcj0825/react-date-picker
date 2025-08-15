import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: true,
        declarationDir: './dist',
        exclude: ['**/__tests__/**']
      }),
      commonjs(),
      postcss({
        modules: {
          generateScopedName: '[name]__[local]___[hash:base64:5]',
          localsConvention: 'camelCase'
        },
        extract: false,
        inject: true,
        minimize: true,
      }),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/datepicker/Datepicker.standalone.css',
    output: {
      file: 'dist/Datepicker.css',
      format: 'es',
    },
    plugins: [
      postcss({
        modules: false,
        extract: true,
        minimize: true,
      }),
    ],
  }
];
