const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withAndroid16KBPageSize(config) {
  return withGradleProperties(config, (config) => {
    const properties = config.modResults;

    // Add 16KB page size support
    properties.push({
      type: 'property',
      key: 'android.experimental.legacyTransform.forceNonIncremental',
      value: 'true',
    });

    return config;
  });
};
