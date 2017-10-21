import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {uglify} from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

function stripEnvVariables(env) {
  return {
    __DEV__: env === 'production' ? 'false' : 'true',
    'process.env.NODE_ENV': `'${env}'`,
  };
}

export default [
  {
    input: 'index.js',
    output: {
      file: 'prop-types.js',
      format: 'umd',
      name: 'PropTypes'
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace(stripEnvVariables('development')),
      nodeResolve(),
      commonjs()
    ]
  },
  {
    input: 'index.js',
    output: {
      file: 'prop-types.min.js',
      format: 'umd',
      name: 'PropTypes'
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace(stripEnvVariables('production')),
      nodeResolve(),
      commonjs(),
      uglify()
    ]
  }
];
