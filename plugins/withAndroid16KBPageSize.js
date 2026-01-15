const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroid16KBPageSize(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;

      // Check if already configured
      if (buildGradle.includes('useLegacyPackaging')) {
        return config;
      }

      // Find the existing packagingOptions block and modify it
      const packagingOptionsRegex = /packagingOptions\s*\{([^}]*)\}/s;

      if (packagingOptionsRegex.test(buildGradle)) {
        // Modify existing packagingOptions
        buildGradle = buildGradle.replace(
          packagingOptionsRegex,
          (match, content) => {
            if (content.includes('jniLibs')) {
              // Already has jniLibs, add useLegacyPackaging
              return match.replace(
                /(jniLibs\s*\{)/,
                '$1\n            useLegacyPackaging true\n'
              );
            } else {
              // Add jniLibs block
              return match.replace(
                /packagingOptions\s*\{/,
                `packagingOptions {\n        jniLibs {\n            useLegacyPackaging true\n        }`
              );
            }
          }
        );
      } else {
        // No packagingOptions, add it before buildTypes
        const packagingBlock = `
    packagingOptions {
        jniLibs {
            useLegacyPackaging true
        }
    }
`;
        buildGradle = buildGradle.replace(
          /(\s+buildTypes\s*\{)/,
          `${packagingBlock}\n$1`
        );
      }

      config.modResults.contents = buildGradle;
    }
    return config;
  });
};
