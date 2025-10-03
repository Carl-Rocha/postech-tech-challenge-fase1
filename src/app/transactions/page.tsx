"use client";

import { useEffect, useState } from "react";
import NewTransaction from "@/components/newTransaction";
import CardExtrato from "@/components/cardExtrato";
import CardSaldo from "@/components/cardSaldo";
import { MenuCard } from "@/components/menu";
import { Transaction } from "@/models/Transaction";
import { TransactionService } from "@/services/TransactionService";
import { useRouter } from 'next/navigation';

function isAuthenticated() {
  console.log(localStorage.getItem("authToken"));
  
  return !!localStorage.getItem("authToken");
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auth, setAuth] = useState<boolean>(false);
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

  const handleNewTransaction = async ({
    type,
    amount,
  }: {
    type: string;
    amount: string;
  }) => {
    const newTransaction = new Transaction({
      id: Date.now(),
      tipo: type,
      valor: parseFloat(amount),
      data: new Date().toISOString().split("T")[0],
    });
    await TransactionService.add(newTransaction);
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleDelete = async (id: number) => {
    await TransactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="d-flex flex-column flex-md-row gap-3 mt-3">
      <div className="col-md-2">
        <MenuCard />
      </div>
      <div className="col-md-6">
        <CardSaldo nomeCliente="Joana" saldoTotal={saldo} />
        <div className="mt-3">
          <NewTransaction onSubmit={handleNewTransaction} />
        </div>
      </div>
      <div className="col-md-4">
        <CardExtrato
          extrato={transactions.map((t) => ({
            id: t.id,
            valor: t.valor,
            data: t.data,
            tipo: t.tipo as "TRANSFERENCIA" | "DEPOSITO",
          }))}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
