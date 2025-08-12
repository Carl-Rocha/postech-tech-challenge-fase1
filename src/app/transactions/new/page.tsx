'use client';

import { useRouter } from 'next/navigation';
import { Transaction } from '@/models/Transaction';
import { TransactionService } from '@/services/TransactionService';
import NewTransaction from '@/components/newTransaction';

export default function NewTransactionPage() {
  const router = useRouter();

  const handleSubmit = async ({ type, amount }: { type: string; amount: string }) => {
    const newTransaction = new Transaction({
      id: Date.now(),
      tipo: type,
      valor: parseFloat(amount),
      data: new Date().toISOString().split('T')[0],
    });
    await TransactionService.add(newTransaction);
    router.push('/transactions');
  };

  return <NewTransaction onSubmit={handleSubmit} />;
}
