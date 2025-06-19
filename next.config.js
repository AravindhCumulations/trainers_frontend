/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'trainers.m.frappe.cloud',
                port: '',
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
                destination: 'https://trainers.m.frappe.cloud/api/:path*'
            },
            {
                source: '/files/:path*',
                destination: 'https://trainers.m.frappe.cloud/files/:path*'
            }
        ]
    },

    async headers() {
        return [
            {
                source: '/files/:path*',
                headers: [
                    {
                        key: 'x-encoded-path',
                        value: ':path*'
                    }
                ]
            }
        ]
    }
};

module.exports = nextConfig; 