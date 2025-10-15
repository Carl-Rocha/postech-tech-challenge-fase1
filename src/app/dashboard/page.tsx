"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setTransactions, TransactionData } from '@/features/transactions/transactionSlice';
import { TransactionService } from '@/services/TransactionService';
import DashboardCards from '@/components/dashboard/DashboardCards';
import TransactionCharts from '@/components/dashboard/TransactionCharts';
import { Box, Typography, Container, Grid } from '@mui/material';

function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setAuth(authenticated);

    if (!authenticated) {
      router.replace('/login');
    } else {
      // localStorage
      TransactionService.getAll().then((savedTransactions) => {
        const serializableTransactions: TransactionData[] = savedTransactions.map(t => ({
          id: t.id,
          tipo: t.tipo,
          valor: t.valor,
          data: t.data,
          comprovanteBase64: t.comprovanteBase64
        }));
        dispatch(setTransactions(serializableTransactions));
      });
    }
  }, [router, dispatch]);

  if (!auth) {
    return null;
  }

  return (
    <div className="container">
      {/* Cards de Resumo */}
      <DashboardCards transactions={transactions} />

      {/* Gráficos */}
      <Box sx={{ mt: 4 }}>
        <TransactionCharts transactions={transactions} />
      </Box>
    </div>
  );
}
