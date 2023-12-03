const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
};

const webpackConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      aws4: false,
    };
    return config;
  },
};

module.exports = {
  ...nextConfig,
  ...webpackConfig,
};
