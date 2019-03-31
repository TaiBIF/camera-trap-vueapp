module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['sort-imports-es6-autofix', 'import'],
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['error', 'unix'],
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
      {
        memberSyntaxSortOrder: ['multiple', 'single', 'all', 'none'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*'],
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
