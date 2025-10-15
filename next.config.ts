import type { NextConfig } from "next";

const sanitizeBaseUrl = (value?: string, fallback: string = "http://localhost:3001"): string => {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

const adminZoneBaseUrl = sanitizeBaseUrl(process.env.ADMIN_ZONE_URL, "http://localhost:3001");
const transactionsZoneBaseUrl = sanitizeBaseUrl(process.env.TRANSACTIONS_ZONE_URL, "http://localhost:3002");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: `${adminZoneBaseUrl}/admin`,
      },
      {
        source: "/admin/:path*",
        destination: `${adminZoneBaseUrl}/admin/:path*`,
      },
      {
        source: "/transactions",
        destination: `${transactionsZoneBaseUrl}/transactions`,
      },
      {
        source: "/transactions/:path*",
        destination: `${transactionsZoneBaseUrl}/transactions/:path*`,
      },
    ];
  },
};

export default nextConfig;
