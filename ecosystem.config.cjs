module.exports = {
  apps: [
    {
      name: 'Blog',
      port: '4571',
      interpreter: 'bun',
      exec_mode: 'fork',
      // instances: 'max',
      script: 'bun',
      args: ['run', './server/index.mjs']
    }
  ]
}
