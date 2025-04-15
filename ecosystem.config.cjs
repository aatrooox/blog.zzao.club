module.exports = {
  apps: [
    {
      name: 'Blog',
      port: '4571',
      exec_mode: 'fork',
      // instances: 'max',
      script: './server/index.mjs',
    }
  ]
}
