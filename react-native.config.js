const isIosSimulatorBuild = process.env.SHELFSCAN_IOS_SIMULATOR === '1';

module.exports = {
  dependencies: isIosSimulatorBuild
    ? { 'react-native-vision-camera-barcode-scanner': { platforms: { ios: null } } }
    : {},
};
