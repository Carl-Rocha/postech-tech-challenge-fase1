"use client";

import { Card, Typography } from '@/design-system';
import { TransactionData } from '@/features/transactions/transactionSlice';
import { CardContent } from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface TransactionChartsProps {
  transactions: TransactionData[];
}

export default function TransactionCharts({ transactions }: TransactionChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const receitasDespesasData = [
    {
      name: 'Receitas',
      valor: transactions
        .filter(t => t.tipo === "DEPOSITO")
        .reduce((acc, t) => acc + t.valor, 0)
    },
    {
      name: 'Despesas',
      valor: transactions
        .filter(t => t.tipo === "TRANSFERENCIA")
        .reduce((acc, t) => acc + t.valor, 0)
    }
  ];

  const mesData = transactions.reduce((acc, transaction) => {
    const mes = new Date(transaction.data).toLocaleDateString('pt-BR', { month: 'short' });
    const key = `${mes}-${new Date(transaction.data).getFullYear()}`;
    
    if (!acc[key]) {
      acc[key] = { mes: key, receitas: 0, despesas: 0 };
    }
    
    if (transaction.tipo === "DEPOSITO") {
      acc[key].receitas += transaction.valor;
    } else {
      acc[key].despesas += transaction.valor;
    }
    
    return acc;
  }, {} as Record<string, { mes: string; receitas: number; despesas: number }>);

  const mesDataArray = Object.values(mesData).slice(-6); // Últimos 6 meses

  // Dados para gráfico por dia (últimos 7 dias)
  const diaData = transactions.reduce((acc, transaction) => {
    const dia = new Date(transaction.data).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
    
    if (!acc[dia]) {
      acc[dia] = { dia, receitas: 0, despesas: 0 };
    }
    
    if (transaction.tipo === "DEPOSITO") {
      acc[dia].receitas += transaction.valor;
    } else {
      acc[dia].despesas += transaction.valor;
    }
    
    return acc;
  }, {} as Record<string, { dia: string; receitas: number; despesas: number }>);

  const diaDataArray = Object.values(diaData).slice(-7); // Últimos 7 dias

  // Dados para gráfico de pizza - maior receitas e despesas
  const pieData = [
    { name: 'Receitas', value: receitasDespesasData[0].valor, color: '#00C853' },
    { name: 'Despesas', value: receitasDespesasData[1].valor, color: '#FF5722' }
  ];

  const COLORS = ['#5D87FF', '#00C853', '#FF5722', '#FF9800', '#9C27B0'];

  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-md-3">
        <Card style={{ 
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
          <CardContent>
            <Typography className="h5">
              Total de Receitas e Despesas
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico por Dia */}
      <div className="col-md-8">
        <Card style={{ 
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
          <CardContent>
            <Typography className="h5">
              Receitas e Despesas por Dia (Últimos 7 dias)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diaDataArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Valor']} />
                <Bar dataKey="receitas" fill="#00C853" name="Receitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" fill="#FF5722" name="Despesas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
