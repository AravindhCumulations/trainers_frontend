/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                arial: ['Arial', 'sans-serif'],
                segoe: ['"Segoe UI"', 'sans-serif'],
            },
            fontSize: {
                '18': ['18px', { lineHeight: '28px' }],
                '16': ['16px', { lineHeight: '24px' }],
                '14': ['14px', { lineHeight: '20px' }],
                '12': ['12px', { lineHeight: '18px' }],
            },
            maxWidth: {
                '8xl': '64rem', // 1408px
                '9xl': '96rem', // 1536px
            },
            fontSize: {
                'text-xxl': ['148px', { lineHeight: '56px', fontWeight: '700' }],
                'text-xl': ['36px', { lineHeight: '44px', fontWeight: '700' }],
                'text-lg': ['32px', { lineHeight: '40px', fontWeight: '400' }],
                'text-md': ['30px', { lineHeight: '38px', fontWeight: '700' }],
                'text-sm': ['28px', { lineHeight: '36px', fontWeight: '700' }],
                'text-xs': ['24px', { lineHeight: '32px', fontWeight: '400' }],
                'text-body': ['18px', { lineHeight: '28px', fontWeight: '400' }],
                'text-caption-semibold': ['14px', { lineHeight: '20px', fontWeight: '600' }],
                'text-caption': ['14px', { lineHeight: '20px', fontWeight: '400' }],
            }
        },
    },
    plugins: [],
} 