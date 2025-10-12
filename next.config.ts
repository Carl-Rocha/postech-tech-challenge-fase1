import type { NextConfig } from "next";

const sanitizeBaseUrl = (value?: string): string => {
  if (!value) {
    return "http://localhost:3001";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "http://localhost:3001";
  }

  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

const adminZoneBaseUrl = sanitizeBaseUrl(process.env.ADMIN_ZONE_URL);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: `${adminZoneBaseUrl}`,
      },
      {
        source: "/admin/:path*",
        destination: `${adminZoneBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
