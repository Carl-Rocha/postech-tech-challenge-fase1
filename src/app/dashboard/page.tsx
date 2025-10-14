"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setTransactions, TransactionData } from '@/features/transactions/transactionSlice';
import { TransactionService } from '@/services/TransactionService';
import DashboardCards from '@/components/dashboard/DashboardCards';
import TransactionCharts, { ChartWidgetKey } from '@/components/dashboard/TransactionCharts';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Paper, Stack } from '@mui/material';

function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}

const DASHBOARD_WIDGET_STORAGE_KEY = 'dashboardWidgets';
const DEFAULT_WIDGETS: ChartWidgetKey[] = ['summary', 'daily', 'monthly', 'categories'];
const widgetLabels: Record<ChartWidgetKey, string> = {
  summary: 'Resumo de receitas e despesas',
  daily: 'Evolução diária',
  monthly: 'Tendência mensal',
  categories: 'Categorias de gasto e receita',
};

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const [auth, setAuth] = useState<boolean>(false);
  const [selectedWidgets, setSelectedWidgets] = useState<ChartWidgetKey[]>(DEFAULT_WIDGETS);

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
          categoria: t.categoria,
          comprovanteBase64: t.comprovanteBase64
        }));
        dispatch(setTransactions(serializableTransactions));
      });
    }
  }, [router, dispatch]);

  useEffect(() => {
    if (!auth) return;
    const stored = localStorage.getItem(DASHBOARD_WIDGET_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          const sanitized = parsed.filter((widget): widget is ChartWidgetKey => DEFAULT_WIDGETS.includes(widget as ChartWidgetKey));
          if (sanitized.length) {
            setSelectedWidgets(sanitized);
          }
        }
      } catch {
        // ignore invalid data
      }
    }
  }, [auth]);

  useEffect(() => {
    if (!auth) return;
    localStorage.setItem(DASHBOARD_WIDGET_STORAGE_KEY, JSON.stringify(selectedWidgets));
  }, [auth, selectedWidgets]);

  const handleWidgetToggle = (widget: ChartWidgetKey) => (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setSelectedWidgets((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, widget]));
      }
      if (prev.length === 1 && prev[0] === widget) {
        return prev;
      }
      return prev.filter((item) => item !== widget);
    });
  };

  const isWidgetChecked = (widget: ChartWidgetKey) => selectedWidgets.includes(widget);

  if (!auth) {
    return null;
  }

  return (
    <div className="container">
      {/* Cards de Resumo */}
      <DashboardCards transactions={transactions} />

      <Box sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: '#f8f9fb', border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>
            Personalize seu dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Escolha os gráficos que deseja visualizar no painel principal.
          </Typography>
          <FormGroup>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {DEFAULT_WIDGETS.map((widget) => (
                <FormControlLabel
                  key={widget}
                  control={
                    <Checkbox
                      checked={isWidgetChecked(widget)}
                      onChange={handleWidgetToggle(widget)}
                      color="primary"
                    />
                  }
                  label={widgetLabels[widget]}
                />
              ))}
            </Stack>
          </FormGroup>
        </Paper>
      </Box>

      {/* Gráficos */}
      <Box sx={{ mt: 4 }}>
        <TransactionCharts transactions={transactions} activeWidgets={selectedWidgets} />
      </Box>
    </div>
  );
}
