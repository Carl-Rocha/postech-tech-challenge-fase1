"use client";

import { useEffect, useState } from "react";
import NewTransaction from "@/components/newTransaction";
import CardExtrato from "@/components/cardExtrato";
import CardSaldo from "@/components/cardSaldo";
import { Transaction } from "@/models/Transaction";
import { TransactionService } from "@/services/TransactionService";
import { useRouter } from 'next/navigation';
import { Button } from "@/design-system";
import ExtratoFilterCard from "@/components/cardExtratoFilter";

function isAuthenticated() {
  console.log(localStorage.getItem("authToken"));
  
  return !!localStorage.getItem("authToken");
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auth, setAuth] = useState<boolean>(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{ id: string; type: string; amount: string; date: string } | null>(null);
  const [filter, setFilter] = useState<{ tipo?: string; dataInicio?: string; dataFim?: string }>({});
  const router = useRouter();

  useEffect(() => {
    const authenticated = isAuthenticated();
    setAuth(authenticated);

    if (!authenticated) {
      router.replace('/login');
    } else {
      TransactionService.getAll().then(setTransactions);
    }
  }, [router]);

  if (!auth) {
    return null;
  }

  const saldo = transactions.reduce(
    (acc, t) => acc + (t.tipo === "DEPOSITO" ? t.valor : -t.valor),
    0
  );

  //filtrar os extratos
  const filteredTransactions = transactions.filter((t) => {
    const matchTipo = filter.tipo ? t.tipo === filter.tipo : true;
    const matchInicio = filter.dataInicio ? new Date(t.data) >= new Date(filter.dataInicio) : true;
    const matchFim = filter.dataFim ? new Date(t.data) <= new Date(filter.dataFim) : true;
    return matchTipo && matchInicio && matchFim;
  }); 

  const handleNewTransaction = async ({
    type,
    amount,
    id,
    comprovanteBase64,
  }: {
    type: string;
    amount: string;
    id?: string;
    comprovanteBase64?: string;
  }) => {
    if (id) {
      // editar
      const updatedTransaction = new Transaction({
        id: parseInt(id),
        tipo: type,
        valor: parseFloat(amount),
        data: editingTransaction?.date || new Date().toISOString().split("T")[0],
        comprovanteBase64
      });
      await TransactionService.update(updatedTransaction);
      setTransactions((prev) => 
        prev.map((t) => t.id === parseInt(id) ? updatedTransaction : t)
      );
      setEditingTransaction(null);
    } else {
      // add transacao
      const newTransaction = new Transaction({
        id: Date.now(),
        tipo: type,
        valor: parseFloat(amount),
        data: new Date().toISOString().split("T")[0],
        comprovanteBase64,
      });
      await TransactionService.add(newTransaction);
      setTransactions((prev) => [...prev, newTransaction]);
    }
  };

  const handleDelete = async (id: number) => {
    await TransactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTransaction = (transaction: { id: string; valor: number; data: string; tipo: string }) => {
    setEditingTransaction({
      id: transaction.id,
      type: transaction.tipo,
      amount: transaction.valor.toString(),
      date: transaction.data
    });
    setIsNewTransactionModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="d-flex justify-content-center gap-3 mt-3">
      <div className="col-md-4">
        <CardSaldo nomeCliente="Joana" saldoTotal={saldo} />
          <Button 
              onClick={() => {
                setEditingTransaction(null);
                setIsNewTransactionModalOpen(true);
              }}
              className="w-100"
              style={{ marginTop: '1rem' }}
            >
              Nova Transação
          </Button>
        <div className="mt-3">
          <CardExtrato
            extrato={filteredTransactions.map((t) => ({
              id: t.id.toString(),
              valor: t.valor,
              data: t.data,
              tipo: t.tipo as "TRANSFERENCIA" | "DEPOSITO",
              comprovanteBase64: t.comprovanteBase64,
            }))}
            onDelete={(id) => handleDelete(parseInt(id))}
            onEdit={handleEditTransaction}
          />
        </div>
      </div>
      <div className="col-md-4">
        <ExtratoFilterCard
          filter={filter}
          setFilter={setFilter}
        />
      </div>
      
      <NewTransaction
        isOpen={isNewTransactionModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleNewTransaction}
        editingTransaction={editingTransaction || undefined}
      />
    </div>
  );
}
