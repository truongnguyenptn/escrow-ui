/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_API_KEY_SECRET: process.env.NEXT_PUBLIC_API_KEY_SECRET,
        NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
        NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL
    },
};

module.exports = nextConfig;
