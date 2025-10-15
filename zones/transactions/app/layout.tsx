import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "Transações",
  description: "Aplicativo de transações isolado (multi-zonas).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ReduxProvider>
          <div className="tx-layout">
            <header className="tx-header">
              <div>
                <strong>Transactions App</strong>
                <span className="tx-badge" style={{ marginLeft: 8 }}>area externa</span>
              </div>
              <UserMenu />
            </header>
            <main className="tx-content">{children}</main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}

