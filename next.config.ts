/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '3.94.205.118                           ',
        port: '8000', // Add the port if needed
        pathname: '**/files/**', // Adjust if needed
      },
    ],

  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://3.94.205.118:8000/api/:path*'
      },

      {
        source: '/files/:path*',
        destination: 'http://3.94.205.118:8000/files/:path*'
      }
    ]
  },
};

module.exports = nextConfig;
