module.exports = {
  extends: [
    'eslint:recommended'
  ],
  'env': {
    'es6': true,
    'browser': true
  },
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'allowImportExportEverywhere': false,
    'codeFrame': false
  },
  'globals': {
    'ENVIRONMENT': true,
    'STANDALONE': true,
    'it': true,
    'describe': true,
    'xdescribe': true,
    'xit': true,
    'before': true,
    'beforeEach': true,
    'after': true,
    'afterEach': true
  },
  'rules': {
    'no-duplicate-imports': 0,
    'indent': [
      'warn',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'warn',
      'single'
    ],
    // 'no-console': [
    //   'warn',
    //   {
    //     'allow': [
    //       'warn',
    //       'error'
    //     ]
    //   }
    // ],
    // for debug
    'no-console': 'off',
    'semi': [
      'error',
      'never',
      {
        'beforeStatementContinuationChars': 'never'
      }
    ],
    'semi-spacing': [
      'error',
      {
        'after': true,
        'before': false
      }
    ],
    'semi-style': [
      'error',
      'first'
    ],
    'no-extra-semi': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'space-before-function-paren': 'off',
    'no-unused-vars': 'warn',
    'comma-dangle': [
      'error',
      'never'
    ],
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1
      }
    ],
    'func-call-spacing': [
      'error',
      'never'
    ],
    'no-unneeded-ternary': 'error',
    'no-var': 'error',
    'space-in-parens': [
      'error',
      'never'
    ],
    'comma-spacing': 'error',
    'computed-property-spacing': 'error',
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    // for chrome, process
    'no-undef': 'off'
  }
}
