import React from 'react';
import styles from './Card.module.css';
import { classNames } from '@/utils/classNames';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  const classes = classNames(styles.card, className);
  return <div {...props} className={classes} />;
}
