const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          loader: 'ware-loader',
          enforce: 'pre',
          options: {
            raw: true,
            middleware: function(source) {
              return `<template><div>${md.render(source)}</div></template>`;
            },
          },
        },
        {
          test: /\.md$/,
          use: 'vue-loader',
        },
      ],
    },
    plugins: (() => {
      const result = [];
      if (['production', 'staging'].indexOf(process.env.VUE_APP_MODE) >= 0) {
        result.push(
          new CompressionWebpackPlugin({
            filename: '[path]',
            algorithm: 'gzip',
            test: /\.js$/,
            threshold: 0,
          }),
        );
      }
      return result;
    })(),
  },
  devServer: {
    proxy: 'http://localhost:8888',
    port: 8888,
  },
};
