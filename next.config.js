/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            // 'unsafe-inline' is required for Next.js hydration scripts
            // 'unsafe-eval' is required for Next.js dev mode and some bundled code
            // blob: is required for browser-image-compression Web Workers
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://pagead2.googlesyndication.com https://www.googletagmanager.com",
            "worker-src 'self' blob:",
            "img-src 'self' blob: data: https:",
            "style-src 'self' 'unsafe-inline'",
            "connect-src 'self' https://api.remove.bg https://*.googlesyndication.com https://*.google.com https://adtrafficquality.google https://ep1.adtrafficquality.google",
            "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
          ].join("; "),
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
