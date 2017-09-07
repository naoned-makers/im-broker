module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // WEB STATIC
    {
      name: 'web',
      script: 'service/web.js',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm',
      env: {},
      env_production: {}
    },
    // MQTT BROKER
    {
      name: 'broker',
      script: 'service/broker.js',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm',
      env: {},
      env_production: {}
    },

    // DDD agregate: im brain
    {
      name: 'brain',
      script: 'service/brain.js',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm',
      env: {},
      env_production: {}
    }
    ,
    // firebase gateway
    {
      name: 'cloud',
      script: 'service/cloud.js',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm',
      env: {},
      env_production: {}
    }
    ,
    // python hardware-gateway
    {
      name: 'synapse',
      //interpreter:'/usr/bin/python'
      interpreter_args:'-u',
      script: 'python/synapse.py',
      restart_delay: 1000,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm',
      env: {
        IM_SYNAPSE_MOCK: 'True'
      },
      // Environment variables injected when starting with --env production
      env_production: {
        IM_SYNAPSE_MOCK: 'False'
      }
    }
  ]
};
