import type { NextConfig } from "next";

/**
 * Strict Content-Security-Policy (CSP) headers config.
 * Securely whitelist approved resource domains to protect against content injection (XSS).
 * 
 * - img-src: Whitelists Cloudinary (res.cloudinary.com) to load high-res product photos.
 * - frame-src: Whitelists Cloudinary and Supabase to allow dynamic vector PDF datasheets 
 *   to embed inside our custom iframe booklet viewer.
 */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  img-src 'self' blob: data: https://res.cloudinary.com https://*.cloudinary.com;
  connect-src * ws: wss: data:;
  frame-src 'self' https://odmxozftqwzjxtnpstsi.supabase.co https://res.cloudinary.com https://*.cloudinary.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  /* Next.js configuration rules */
  allowedDevOrigins: [
    "192.168.0.101",
    "192.168.0.104",
    "192.168.0.104:3000",
    "192.168.0.107",
    "192.168.0.107:3000",
    "192.168.56.1",
    "localhost:3000"
  ],
  async headers() {
    if (process.env.NODE_ENV === "development") {
      return [];
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
