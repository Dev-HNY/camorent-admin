const { withAppBuildGradle, withGradleProperties } = require('@expo/config-plugins');

module.exports = function withAndroid16KBPageSize(config) {
  // Add gradle properties
  config = withGradleProperties(config, (config) => {
    const properties = config.modResults;

    // Enable 16KB page size support
    properties.push({
      type: 'property',
      key: 'android.bundle.enableUncompressedNativeLibs',
      value: 'false',
    });

    return config;
  });

  // Add build.gradle configuration
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;

      // Check if 16KB config already exists
      if (buildGradle.includes('splits {')) {
        return config;
      }

      // Add splits configuration for 16KB page size support
      const splitsConfig = `
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk false
        }
    }
`;

      // Insert before buildTypes
      buildGradle = buildGradle.replace(
        /(\s+buildTypes\s*\{)/,
        `${splitsConfig}\n$1`
      );

      config.modResults.contents = buildGradle;
    }
    return config;
  });

  return config;
};
