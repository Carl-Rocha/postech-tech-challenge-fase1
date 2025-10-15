import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zona Administrativa",
  description:
    "Área administrativa isolada que compõe a arquitetura multi-zonas da aplicação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="layout">
          <header className="layout__header">
            <span className="layout__badge">area externa</span>
            <strong>Central de Operações</strong>
          </header>
          <main className="layout__content">{children}</main>
        </div>
      </body>
    </html>
  );
}
