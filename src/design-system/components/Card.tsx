import React from 'react';
import styles from './Card.module.css';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', ...props }: CardProps) {
  const classes = [styles.card, className].join(' ').trim();
  return <div className={classes} {...props} />;
}
