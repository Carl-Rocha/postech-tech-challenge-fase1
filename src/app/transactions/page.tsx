"use client";

import { useEffect, useMemo, useState } from "react";
import NewTransaction from "@/components/newTransaction";
import CardExtrato from "@/components/cardExtrato";
import CardSaldo from "@/components/cardSaldo";
import { Transaction } from "@/models/Transaction";
import { TransactionService } from "@/services/TransactionService";
import { useRouter } from 'next/navigation';
import { Button } from "@/design-system";
import ExtratoFilterCard from "@/components/cardExtratoFilter";
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setTransactions, addTransaction, updateTransaction, removeTransaction, TransactionData } from '@/features/transactions/transactionSlice';

type TransactionFilter = {
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
  categoria?: string;
  minValor?: string;
  maxValor?: string;
};

const parseValor = (valor?: string): number | null => {
  if (!valor) return null;
  const normalizado = valor.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(normalizado);
  return Number.isFinite(parsed) ? parsed : null;
};

function isAuthenticated() {
  console.log(localStorage.getItem("authToken"));
  
  return !!localStorage.getItem("authToken");
}

export default function Transactions() {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const [auth, setAuth] = useState<boolean>(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    type: string;
    amount: string;
    date: string;
    categoria?: string;
    comprovanteBase64?: string;
  } | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>({});
  const router = useRouter();

  useEffect(() => {
    const authenticated = isAuthenticated();
    setAuth(authenticated);

    if (!authenticated) {
      router.replace('/login');
    } else {
      TransactionService.getAll().then((savedTransactions) => {
        // Converter instâncias da classe Transaction para objetos simples
        const serializableTransactions: TransactionData[] = savedTransactions.map(t => ({
          id: t.id,
          tipo: t.tipo,
          valor: t.valor,
          data: t.data,
          categoria: t.categoria,
          comprovanteBase64: t.comprovanteBase64
        }));
        dispatch(setTransactions(serializableTransactions));
      });
    }
  }, [router, dispatch]);

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
    const matchCategoria = filter.categoria
      ? (t.categoria || '').toLowerCase() === filter.categoria.toLowerCase()
      : true;
    const searchTerm = filter.search?.trim().toLowerCase();
    const matchBusca = searchTerm
      ? [t.tipo, t.categoria, t.valor.toLocaleString('pt-BR')]
        .filter(Boolean)
        .some((field) => field!.toString().toLowerCase().includes(searchTerm))
      : true;
    const minValor = parseValor(filter.minValor);
    const maxValor = parseValor(filter.maxValor);
    const matchMin = minValor !== null ? t.valor >= minValor : true;
    const matchMax = maxValor !== null ? t.valor <= maxValor : true;

    return matchTipo && matchInicio && matchFim && matchCategoria && matchBusca && matchMin && matchMax;
  });

  const availableCategories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.categoria).filter((categoria): categoria is string => !!categoria))).sort(),
    [transactions]
  );

  const handleNewTransaction = async ({
    type,
    amount,
    id,
    categoria,
    comprovanteBase64,
  }: {
    type: string;
    amount: string;
    id?: string;
    categoria?: string;
    comprovanteBase64?: string;
  }) => {
    const parsedAmount = parseValor(amount) ?? 0;
    if (id) {
      // editar
      const updatedTransaction = new Transaction({
        id: parseInt(id),
        tipo: type,
        valor: parsedAmount,
        data: editingTransaction?.date || new Date().toISOString().split("T")[0],
        categoria,
        comprovanteBase64
      });
      await TransactionService.update(updatedTransaction);
      // Converter para formato serializável
      const serializableTransaction: TransactionData = {
        id: updatedTransaction.id,
        tipo: updatedTransaction.tipo,
        valor: updatedTransaction.valor,
        data: updatedTransaction.data,
        categoria: updatedTransaction.categoria,
        comprovanteBase64: updatedTransaction.comprovanteBase64
      };
      dispatch(updateTransaction(serializableTransaction));
      setEditingTransaction(null);
    } else {
      // add transacao
      const newTransaction = new Transaction({
        id: Date.now(),
        tipo: type,
        valor: parsedAmount,
        data: new Date().toISOString().split("T")[0],
        categoria,
        comprovanteBase64,
      });
      await TransactionService.add(newTransaction);
      // Converter para formato serializável
      const serializableTransaction: TransactionData = {
        id: newTransaction.id,
        tipo: newTransaction.tipo,
        valor: newTransaction.valor,
        data: newTransaction.data,
        categoria: newTransaction.categoria,
        comprovanteBase64: newTransaction.comprovanteBase64
      };
      dispatch(addTransaction(serializableTransaction));
    }
  };

  const handleDelete = async (id: number) => {
    await TransactionService.remove(id);
    dispatch(removeTransaction(id));
  };

  const handleEditTransaction = (transaction: { id: string; valor: number; data: string; tipo: string; categoria?: string; comprovanteBase64?: string }) => {
    setEditingTransaction({
      id: transaction.id,
      type: transaction.tipo,
      amount: transaction.valor.toString(),
      date: transaction.data,
      categoria: transaction.categoria,
      comprovanteBase64: transaction.comprovanteBase64
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
              categoria: t.categoria,
              comprovanteBase64: t.comprovanteBase64,
            }))}
            onDelete={(id) => handleDelete(parseInt(id))}
            onEdit={handleEditTransaction}
            pageSize={10}
          />
        </div>
      </div>
      <div className="col-md-4">
        <ExtratoFilterCard
          filter={filter}
          setFilter={setFilter}
          availableCategories={availableCategories}
        />
      </div>

      <NewTransaction
        isOpen={isNewTransactionModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleNewTransaction}
        editingTransaction={editingTransaction || undefined}
        availableCategories={availableCategories}
      />
    </div>
  );
}
