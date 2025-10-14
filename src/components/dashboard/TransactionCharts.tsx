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

export type ChartWidgetKey = 'summary' | 'daily' | 'monthly' | 'categories';

interface TransactionChartsProps {
  transactions: TransactionData[];
  activeWidgets?: ChartWidgetKey[];
}

const ALL_WIDGETS: ChartWidgetKey[] = ['summary', 'daily', 'monthly', 'categories'];

export default function TransactionCharts({ transactions, activeWidgets }: TransactionChartsProps) {
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

  const categoryAggregations = transactions.reduce((acc, transaction) => {
    const categoria = (transaction.categoria || 'Outros').trim();
    if (!acc[categoria]) {
      acc[categoria] = { categoria, receitas: 0, despesas: 0 };
    }
    if (transaction.tipo === 'DEPOSITO') {
      acc[categoria].receitas += transaction.valor;
    } else {
      acc[categoria].despesas += transaction.valor;
    }
    return acc;
  }, {} as Record<string, { categoria: string; receitas: number; despesas: number }>);

  const categoryData = Object.values(categoryAggregations)
    .map((categoria) => ({
      ...categoria,
      saldo: categoria.receitas - categoria.despesas,
    }))
    .sort((a, b) => b.despesas - a.despesas)
    .slice(0, 5);

  const selectedWidgets = activeWidgets && activeWidgets.length ? activeWidgets : ALL_WIDGETS;
  const cardStyle = { height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };

  const renderEmptyState = (message: string) => (
    <div className="d-flex align-items-center justify-content-center" style={{ height: 280 }}>
      <Typography className="text-muted text-center" as="p">
        {message}
      </Typography>
    </div>
  );

  const widgetConfigs: Record<ChartWidgetKey, { className: string; render: () => JSX.Element }> = {
    summary: {
      className: 'col-12 col-lg-4',
      render: () => (
        <Card style={cardStyle}>
          <CardContent>
            <Typography className="h5">
              Total de Receitas e Despesas
            </Typography>
            {transactions.length === 0 ? (
              renderEmptyState('Cadastre transações para visualizar a composição do fluxo financeiro.')
            ) : (
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
            )}
          </CardContent>
        </Card>
      ),
    },
    daily: {
      className: 'col-12 col-lg-8',
      render: () => (
        <Card style={cardStyle}>
          <CardContent>
            <Typography className="h5">
              Receitas e Despesas por Dia (Últimos 7 dias)
            </Typography>
            {diaDataArray.length === 0 ? (
              renderEmptyState('Sem movimentações recentes nos últimos dias.')
            ) : (
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
            )}
          </CardContent>
        </Card>
      ),
    },
    monthly: {
      className: 'col-12 col-lg-6',
      render: () => (
        <Card style={cardStyle}>
          <CardContent>
            <Typography className="h5">
              Evolução Mensal (últimos 6 meses)
            </Typography>
            {mesDataArray.length === 0 ? (
              renderEmptyState('Ainda não há dados suficientes para montar a tendência mensal.')
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mesDataArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Valor']} />
                  <Line type="monotone" dataKey="receitas" stroke="#00C853" name="Receitas" strokeWidth={2} />
                  <Line type="monotone" dataKey="despesas" stroke="#FF5722" name="Despesas" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      ),
    },
    categories: {
      className: 'col-12 col-lg-6',
      render: () => (
        <Card style={cardStyle}>
          <CardContent>
            <Typography className="h5">
              Top Categorias por Valor Movimentado
            </Typography>
            {categoryData.length === 0 ? (
              renderEmptyState('Classifique as suas transações para acompanhar categorias de gasto e receita.')
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Valor']} />
                  <Bar dataKey="despesas" fill="#FF7043" name="Despesas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="receitas" fill="#66BB6A" name="Receitas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      ),
    },
  };

  const widgetsToRender = selectedWidgets.filter((key): key is ChartWidgetKey => key in widgetConfigs);

  return (
    <div className="row g-3 justify-content-center">
      {widgetsToRender.map((key) => {
        const config = widgetConfigs[key];
        if (!config) return null;
        return (
          <div key={key} className={`${config.className} d-flex`}>
            {config.render()}
          </div>
        );
      })}
    </div>
  );
}
