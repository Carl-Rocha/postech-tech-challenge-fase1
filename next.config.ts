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
      {
        source: "/_next/static/chunks/zones_admin_:path*",
        destination: `${adminZoneBaseUrl}/_next/static/chunks/:path*`,
      },
      {
        source: "/_next/static/css/zones_admin_:path*",
        destination: `${adminZoneBaseUrl}/_next/static/css/:path*`,
      },
      {
        source: "/_next/data/zones_admin/:path*",
        destination: `${adminZoneBaseUrl}/_next/data/:path*`,
      },
    ];
  },
};

export default nextConfig;
