if (process.env.NODE_ENV !== 'production') {
  const dotEnvResult = require('dotenv').config();
  if (dotEnvResult.error) {
    throw dotEnvResult.error;
  }
}

const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

const nextConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  webpack(config) {
    return config;
  },
};

module.exports = {
  env: {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_UPLOAD_PRESET_AUDIO: process.env.CLOUDINARY_UPLOAD_PRESET_AUDIO,
    CLOUDINARY_UPLOAD_PRESET_AVATAR:
      process.env.CLOUDINARY_UPLOAD_PRESET_AVATAR,
    CLOUDINARY_UPLOAD_PRESET_CUSTOM_THUMBNAIL:
      process.env.CLOUDINARY_UPLOAD_PRESET_CUSTOM_THUMBNAIL,
  },
  ...withBundleAnalyzer(nextConfig),
};
