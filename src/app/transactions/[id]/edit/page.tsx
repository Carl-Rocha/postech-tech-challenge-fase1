"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Transaction } from "@/models/Transaction";
import { TransactionService } from "@/services/TransactionService";
import NewTransaction from "@/components/newTransaction";
import { Button, Typography } from "@/design-system";

export default function EditarTransacaoPage() {
  const params = useParams();
  const router = useRouter();

  const id = useMemo(() => {
    const raw = (params as Record<string, string | string[]>)?.id;
    const val = Array.isArray(raw) ? raw[0] : raw;
    const asNumber = Number(val);
    return Number.isFinite(asNumber) ? asNumber : null;
  }, [params]);

  const [transacao, setTransacao] = useState<Transaction | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      if (id == null) {
        setErro("ID inválido.");
        setCarregando(false);
        return;
      }

      try {
        const t = await TransactionService.getById(id);
        if (!ativo) return;

        if (!t) {
          setErro("Transação não encontrada.");
          setTransacao(null);
        } else {
          setTransacao(t);
          setErro(null);
        }
      } catch {
        setErro("Falha ao carregar. Tente novamente.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [id]);

  function parseValorBR(valorTexto: string): number {
    const limpo = valorTexto.trim().replace(/\s/g, "");
    // se tiver vírgula, assume formato BR
    if (/,/.test(limpo)) {
      return Number(limpo.replace(/\./g, "").replace(",", "."));
    }
    return Number(limpo);
  }

  const handleSubmit = async ({
    type,
    amount,
  }: {
    type: string;
    amount: string;
  }) => {
    if (!transacao) return;
    const valor = parseValorBR(amount);
    if (!Number.isFinite(valor) || valor < 0) {
      setErro("Valor inválido.");
      return;
    }

    setSalvando(true);
    try {
      const atualizado = new Transaction({
        id: transacao.id,
        tipo: type || transacao.tipo,
        valor,
        data: transacao.data,
      });

      await TransactionService.update(atualizado);
      router.push("/transactions");
    } catch {
      setErro("Não foi possível salvars");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <Typography>...</Typography>;
  }

  if (erro) {
    return (
      <div className="mt-4 space-y-3">
        <Typography role="alert">{erro}</Typography>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button onClick={() => router.refresh()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  if (!transacao) {
    return (
      <div className="mt-4">
        <Typography>Sem dados para exibir.</Typography>
        <Button className="mt-3" onClick={() => router.push("/transactions")}>
          Ir para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center gap-8">
        <Button variant="secondary" onClick={() => router.back()}>
          Voltar
        </Button>
        <Typography as="h1">Editar transação #{transacao.id}</Typography>
      </div>

      <NewTransaction
        initial={{ type: transacao.tipo, amount: transacao.valor.toString() }}
        onSubmit={handleSubmit}
      />

      {salvando && <Typography className="mt-2">Salvando…</Typography>}
    </div>
  );
}
