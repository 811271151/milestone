const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Keep Metro's parallel cache reads within Windows' practical file-handle limits.
config.maxWorkers = 2;

module.exports = config;
