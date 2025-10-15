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

const adminZoneBaseUrl = (process.env.ADMIN_ZONE_URL || process.env.NEXT_PUBLIC_ADMIN_ZONE_URL)
  ? sanitizeBaseUrl(process.env.ADMIN_ZONE_URL || process.env.NEXT_PUBLIC_ADMIN_ZONE_URL)
  : undefined;
const transactionsZoneBaseUrl = (process.env.TRANSACTIONS_ZONE_URL || process.env.NEXT_PUBLIC_TRANSACTIONS_ZONE_URL)
  ? sanitizeBaseUrl(process.env.TRANSACTIONS_ZONE_URL || process.env.NEXT_PUBLIC_TRANSACTIONS_ZONE_URL)
  : undefined;

const enableAdminZone = (process.env.ENABLE_ADMIN_ZONE === 'true') || (process.env.NEXT_PUBLIC_ENABLE_ADMIN_ZONE === 'true');
const enableTransactionsZone = (process.env.ENABLE_TRANSACTIONS_ZONE === 'true') || (process.env.NEXT_PUBLIC_ENABLE_TRANSACTIONS_ZONE === 'true');

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const rules = [] as { source: string; destination: string }[];

    if (enableAdminZone && adminZoneBaseUrl) {
      rules.push(
        { source: "/admin", destination: `${adminZoneBaseUrl}/admin` },
        { source: "/admin/:path*", destination: `${adminZoneBaseUrl}/admin/:path*` },
      );
    }

    if (enableTransactionsZone && transactionsZoneBaseUrl) {
      rules.push(
        { source: "/transactions", destination: `${transactionsZoneBaseUrl}/transactions` },
        { source: "/transactions/:path*", destination: `${transactionsZoneBaseUrl}/transactions/:path*` },
      );
    }

    return rules;
  },
};

export default nextConfig;
