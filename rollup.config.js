import typescript from "rollup-plugin-typescript2"
import dts from "rollup-plugin-dts"
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default [
  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: 'webpackmpplugin'
    },
    plugins: [
      json(),
      commonjs({
        namedExports: {'tslib': ['__awaiter', '__generator']}
     }),
      typescript(),
      terser()
    ]
  },


  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    plugins: [
      json(),
      commonjs({
        namedExports: {'tslib': ['__awaiter', '__generator']}
     }),
      typescript()
    ]
  },

  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "es"
    },
    plugins: [
      json(),
      commonjs({
        namedExports: {'tslib': ['__awaiter', '__generator']}
     }),
      typescript(),
    ]
  },

  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.d.ts",
    },
    plugins: [
      dts()
    ]
  }
]