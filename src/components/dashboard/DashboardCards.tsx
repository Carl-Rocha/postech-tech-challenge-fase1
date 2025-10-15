"use client";

import { TransactionData } from '@/features/transactions/transactionSlice';
import { Box, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import { Card, Typography } from '@/design-system';

interface DashboardCardsProps {
  transactions: TransactionData[];
}

export default function DashboardCards({ transactions }: DashboardCardsProps) {
  // totais
  const saldoAtual = transactions.reduce(
    (acc, t) => acc + (t.tipo === "DEPOSITO" ? t.valor : -t.valor),
    0
  );

  const totalReceitas = transactions
    .filter(t => t.tipo === "DEPOSITO")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transactions
    .filter(t => t.tipo === "TRANSFERENCIA")
    .reduce((acc, t) => acc + t.valor, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: 'Saldo Atual',
      value: formatCurrency(saldoAtual),
      icon: <AccountBalance sx={{ fontSize: 40, color: '#5D87FF' }} />,
      color: '#5D87FF',
      bgColor: '#EEF3FC'
    },
    {
      title: 'Total Receitas',
      value: formatCurrency(totalReceitas),
      icon: <TrendingUp sx={{ fontSize: 40, color: '#00C853' }} />,
      color: '#00C853',
      bgColor: '#E8F5E8'
    },
    {
      title: 'Total Despesas',
      value: formatCurrency(totalDespesas),
      icon: <TrendingDown sx={{ fontSize: 40, color: '#FF5722' }} />,
      color: '#FF5722',
      bgColor: '#FFEBEE'
    }
  ];

  return (
    <div className="row align-items-center justify-content-center">
      {cards.map((card, index) => (
        <div className="col-md-3 mb-2" key={index}>
          <Card 
            style={{ 
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent className="p-2">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: card.bgColor,
                    mr: 2
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography 
                    className="h6" 
                    style={{ 
                      color: '#7f8c8d',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography 
                    className="h4" 
                    style={{ 
                      color: card.color,
                      fontWeight: 'bold',
                      fontSize: '1.8rem'
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
