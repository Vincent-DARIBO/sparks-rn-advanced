const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins');

module.exports = function withVibratePermission(config) {
  return withAndroidManifest(config, (modConfig) => {
    AndroidConfig.Permissions.ensurePermissions(modConfig.modResults, [
      'android.permission.VIBRATE',
    ]);
    return modConfig;
  });
};
