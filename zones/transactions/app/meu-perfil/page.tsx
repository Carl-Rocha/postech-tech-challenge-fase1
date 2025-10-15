"use client";
import { useEffect, useState } from "react";
import { Input, Button, Card, Typography } from "@/design-system";
import { useRouter } from "next/navigation";

function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}

export default function MeuPerfil() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/login');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword.length < 6) {
      setMessage('A nova senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('A confirmação de senha não confere.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('authToken') ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` } : {})
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao trocar senha');
      setMessage('Senha alterada com sucesso.');
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="tx-grid">
      <section className="tx-card" style={{ gridColumn: '1 / span 2' }}>
        <Typography variant="heading" style={{ marginTop: 0 }}>Meu Perfil</Typography>
        <p>Altere sua senha de acesso.</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
          <Input
            type="password"
            placeholder="Senha atual"
            value={oldPassword}
            onChange={(e: any) => setOldPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e: any) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            required
          />
          <div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Trocar senha'}
            </Button>
          </div>
        </form>
        {message && (
          <div style={{ marginTop: 10, color: message.includes('sucesso') ? 'green' : 'crimson' }}>{message}</div>
        )}
      </section>
    </div>
  );
}

