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
            "script-src 'self' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com",
            "img-src 'self' blob: data: https:",
            "style-src 'self' 'unsafe-inline'",
            "connect-src 'self' https://api.remove.bg",
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
