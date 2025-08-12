'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Transaction } from '@/models/Transaction';
import { TransactionService } from '@/services/TransactionService';
import { Button, Card, Typography } from '@/design-system';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    TransactionService.getAll().then(setTransactions);
  }, []);

  const handleDelete = async (id: number) => {
    await TransactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="mt-4">
      <Typography as="h1" variant="heading" className="mb-4">
        Transações
      </Typography>
      {transactions.map((t) => (
        <Card key={t.id} className="mb-3 p-3 d-flex justify-content-between align-items-center">
          <div>
            <Typography className="fw-bold">{t.tipo}</Typography>
            <Typography className="text-muted">{t.data}</Typography>
            <Typography>R$ {t.valor.toFixed(2)}</Typography>
          </div>
          <div className="d-flex gap-2">
            <Link href={`/transactions/${t.id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
            <Button variant="danger" onClick={() => handleDelete(t.id)}>
              Excluir
            </Button>
          </div>
        </Card>
      ))}
      <Link href="/transactions/new">
        <Button className="mt-3">Nova transação</Button>
      </Link>
    </div>
  );
}
