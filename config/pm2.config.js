module.exports = {
  apps: [
    {
      name: 'api-gateway',
      exec_mode: 'fork',
      script: '/srv/bin/caddy',
      args: '-conf /etc/Caddyfile',
      merge_logs: true,
      restart_delay: 5000,
      env: {
        watch: false,
        autorestart: true,
      },
    },
    {
      name: 'api-main',
      exec_mode: 'fork',
      script: '/srv/packages/api-main/dist/index.js',
      merge_logs: true,
      restart_delay: 3000,
      env: {
        watch: false,
        autorestart: true,
      },
    },
    {
      name: 'web-main',
      exec_mode: 'fork',
      cwd: '/srv/packages/web-main',
      script: 'server.js',
      merge_logs: true,
      restart_delay: 3000,
      env: {
        watch: false,
        autorestart: true,
      },
    },
  ],
}
