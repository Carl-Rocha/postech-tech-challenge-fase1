import React from 'react';
import styles from './Input.module.css';
import { classNames } from '@/utils/classNames';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  const classes = classNames(styles.input, className);
  return <input {...props} className={classes} />;
}
