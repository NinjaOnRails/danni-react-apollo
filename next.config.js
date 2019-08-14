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
  },
  ...withBundleAnalyzer(nextConfig),
};
