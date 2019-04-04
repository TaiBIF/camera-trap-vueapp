module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'babel-plugin-idx',
      {
        importName: './idx',
      },
    ],
  ],
};
