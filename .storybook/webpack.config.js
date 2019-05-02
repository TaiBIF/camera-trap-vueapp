const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.sass$|.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, '../src'),
  };

  return config;
};
