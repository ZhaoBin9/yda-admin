module.exports = {
  root: true,
  env: {
    es6: true, // 启用 ES6 语法支持以及新的 ES6 全局变量或类型
    node: true, // Node.js 全局变量和 Node.js 作用域
    browser: true // 浏览器全局变量
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-v-model-argument': 'off'
  }
}
