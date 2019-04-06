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
  },
  devServer: {
    proxy: 'http://localhost:8888',
    port: 8888,
  },
};
