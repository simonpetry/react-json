import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/react-json.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    name: 'reactJSON'
  },
  external: ['react'],
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    uglify()
  ]
};