module.exports = {
  apps: [
    {
      name: 'mce-web',
      instances: 'max',
      exec_mode: 'cluster',
      cwd: '/srv/web',
      script: 'yarn',
      args: 'start',
      merge_logs: true,
      restart_delay: 5000,
      wait_ready: true,
      env: {
        watch: false,
        autorestart: true,
      },
    },
    {
      name: 'mce-api',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',
      script: '/srv/api/mce',
      args: '-c /srv/config/config.yml',
      merge_logs: true,
      restart_delay: 3000,
      wait_ready: true,
      env: {
        watch: false,
        autorestart: true,
      },
    },
    {
      name: 'caddy',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',
      script: '/srv/caddy',
      args: '-conf /srv/config/Caddyfile',
      merge_logs: true,
      restart_delay: 3000,
      wait_ready: true,
      env: {
        watch: false,
        autorestart: true,
      },
    },
  ],
}