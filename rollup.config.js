import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export function disallowedImports() {
  return {
    resolveId: module => {
      if (module === 'vega' || module === 'util') {
        throw new Error('Cannot import from Vega or Node Util in Vega-Lite.');
      }
      return null;
    }
  };
}

export default {
  input: 'dist/index.js',
  output: {
    file: 'build/bundle.js',
    format: 'umd',
    sourcemap: true,
    name: 'vl'
  },
  plugins: [disallowedImports(), nodeResolve({browser: true}), commonjs(), json(), sourcemaps()]
};