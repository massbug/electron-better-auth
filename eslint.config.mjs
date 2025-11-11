import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['dist', 'dist-electron', 'node_modules', 'release'],
  formatters: true,
  react: true,
}, {
  rules: {
    'node/prefer-global/process': ['off'],
  },
})
