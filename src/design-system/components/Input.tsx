import React from 'react';
import styles from './Input.module.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  const classes = [styles.input, className].join(' ').trim();
  return <input className={classes} {...props} />;
}
