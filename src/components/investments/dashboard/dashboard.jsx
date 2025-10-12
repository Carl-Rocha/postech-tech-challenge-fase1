// Dashboard.js
import React from 'react';
import TotalCard from '../totalCard/totalCard';
import StatsSection from '../statsSection/statsSection';
import styles from './dashboard.module.css'; 

const investmentData = [
  { name: 'Total Investido', amount: 'R$ 80.000,00' },
  { name: 'Renda Fixa', amount: 'R$ 45.000,00' },
  { name: 'Renda Variável', amount: 'R$ 26.000,00' },
];

const chartData = [
  { label: 'Fundos de investimento', value: 30000 },
  { label: 'Tesouro Direto', value: 20000 },
  { label: 'Previdência Privada', value: 10000 },
  { label: 'Bolsa de Valores', value: 2000 },
];

function Dashboard() {
  return (
    <div className={styles.container}>
      {/* Título e Total */}
      <h1 className={styles.title}>Investimentos</h1>
      <p className={styles.total}>Total: {investmentData.total}</p>

      {/* Cards de Renda */}
      <div className={styles.cardSection}>
        <TotalCard title="Renda Fixa" amount={investmentData.fixedIncome} />
        <TotalCard title="Renda variável" amount={investmentData.variableIncome} />
      </div>

      {/* Seção de Estatísticas */}
      <h2 className={styles.subtitle}>Estatísticas</h2>
      <StatsSection data={chartData} />
    </div>
  );
}

export default Dashboard;