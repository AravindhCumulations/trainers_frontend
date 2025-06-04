/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '3.94.205.118',
                port: '8000',
                pathname: '**/files/**',
            },
        ],
        domains: ['localhost'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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