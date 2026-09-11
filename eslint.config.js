const js = require('@eslint/js')
const globals = require('globals')
const react = require('eslint-plugin-react')
module.exports = [
  {
    ignores: ['docs/**', 'dev_build/**', 'node_modules/**', 'src/web-taro/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  }
]
