import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['dist', 'dist-electron', 'node_modules', 'release', 'hono/src/generated', 'README.md', 'hono/README.md'],
  formatters: true,
  react: true,
}, {
  rules: {
    'node/prefer-global/process': ['off'],
  },
})
