// TotalCard.js
import React from 'react';
import styles from './totalCard.module.css';

function TotalCard({ title, amount }) {
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardAmount}>{amount}</p>
    </div>
  );
}

export default TotalCard;