'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Transaction } from '@/models/Transaction';
import { TransactionService } from '@/services/TransactionService';
import NewTransaction from '@/components/newTransaction';
import { Button, Typography } from '@/design-system';

export default function EditTransactionPage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const id = Number(params?.id);
    if (!Number.isNaN(id)) {
      TransactionService.getById(id).then((t) => setTransaction(t ?? null));
    }
  }, [params]);

  const handleSubmit = async ({ type, amount }: { type: string; amount: string }) => {
    if (!transaction) return;
    const updated = new Transaction({
      id: transaction.id,
      tipo: type,
      valor: parseFloat(amount),
      data: transaction.data,
    });
    await TransactionService.update(updated);
    router.push('/transactions');
  };

  if (!transaction) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <div className="mt-4">
      <Button variant="secondary" className="mb-3" onClick={() => router.back()}>
        Voltar
      </Button>
      <NewTransaction
        initial={{ type: transaction.tipo, amount: transaction.valor.toString() }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
