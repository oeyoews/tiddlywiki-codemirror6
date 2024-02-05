import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.js',
  output: [
    {
      format: 'cjs',
      file: './dist/index.cjs'
    },
    {
      format: 'es',
      file: './dist/index.js'
    }
  ]
  // external: ['@lezer/highlight', '@lezer/lr'],
  // external(id) {
  //   return !/^[\.\/]/.test(id);
  // },
  // plugins: [nodeResolve()]
};
