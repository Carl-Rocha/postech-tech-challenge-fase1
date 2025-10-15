"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

function parseUsernameFromToken(): string | null {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return payload?.username ?? null;
  } catch {
    return null;
  }
}

export default function UserMenu() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const name = parseUsernameFromToken();
    if (name) setUsername(name);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ opacity: 0.9 }}>Olá, {username || "Usuário"}</span>
      <Link href="/transactions/meu-perfil" style={{ textDecoration: "none", fontWeight: 600 }}>
        Meu Perfil
      </Link>
    </div>
  );
}

