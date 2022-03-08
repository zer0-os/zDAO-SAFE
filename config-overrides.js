const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/helpers': path.resolve(__dirname, 'src/helpers'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/states': path.resolve(__dirname, 'src/states'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/views': path.resolve(__dirname, 'src/views'),
    },
  };

  return config;
};
