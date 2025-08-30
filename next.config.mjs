/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
        ],
    },
     webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/i,
      type: "asset/resource", // cho phép import file media
    });
    return config;
  },
};

export default nextConfig;
