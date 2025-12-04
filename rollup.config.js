import dts from 'rollup-plugin-dts';

export default {
  input: './dist/types/index.d.ts', // Entry point of your type declarations
  output: {
    file: './dist/index.d.ts', // Output file for the bundled type declarations
    format: 'es',
  },
  plugins: [dts()],
};