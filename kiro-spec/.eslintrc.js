module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended'
    ],
    env: {
        node: true,
        es2020: true
    },
    rules: {
        // 允许console.log，因为这是开发工具
        'no-console': 'off',
        
        // 基础TypeScript规则
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        
        // 代码风格
        'prefer-const': 'error',
        'no-var': 'error',
        'semi': ['error', 'always'],
        'quotes': ['error', 'single', { allowTemplateLiterals: true }],
        
        // 禁用一些可能有问题的规则
        'no-undef': 'off', // TypeScript会处理这个
        'no-unused-vars': 'off', // 使用TypeScript版本
    },
    ignorePatterns: [
        'out/**/*',
        'node_modules/**/*',
        '*.vsix',
        'templates/**/*'
    ]
};