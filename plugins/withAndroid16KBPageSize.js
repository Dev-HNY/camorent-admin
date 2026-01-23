const { withAppBuildGradle, withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroid16KBPageSize(config) {
  // Add manifest property for 16KB page size support
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;

    // Add property to application tag
    if (androidManifest.application && androidManifest.application[0]) {
      const app = androidManifest.application[0];

      // Add 16KB page size support property
      if (!app.$) {
        app.$ = {};
      }

      // This property declares support for 16KB page sizes
      app.$['android:allowNativeHeapPointerTagging'] = 'false';
    }

    return config;
  });

  // Configure packaging options for 16KB support
  config = withAppBuildGradle(config, (config) => {
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
              // Already has jniLibs, ensure useLegacyPackaging is false
              return match.replace(
                /(jniLibs\s*\{)/,
                '$1\n            useLegacyPackaging false\n'
              );
            } else {
              // Add jniLibs block with useLegacyPackaging false
              return match.replace(
                /packagingOptions\s*\{/,
                `packagingOptions {\n        jniLibs {\n            useLegacyPackaging false\n        }`
              );
            }
          }
        );
      } else {
        // No packagingOptions, add it before buildTypes
        const packagingBlock = `
    packagingOptions {
        jniLibs {
            useLegacyPackaging false
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

  return config;
};
