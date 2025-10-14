// StatsSection.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './statsSection.module.css';

const LegendItem = ({ color, name }) => (
  <div className={styles.legendItem}>
    <span style={{ backgroundColor: color }} className={styles.legendDot}></span>
    {name}
  </div>
);

function StatsSection({ data }) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.statsCard}>
      <div className={styles.chartContainer}>
        {/* Gráfico de Pizza/Donut */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              cx="50%" 
              cy="50%"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {data.map((item, index) => (
          <LegendItem key={index} color={item.color} name={item.name} />
        ))}
      </div>
    </div>
  );
}

export default StatsSection;