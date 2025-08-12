import React from 'react';
import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].join(' ').trim();
  return <button className={classes} {...props} />;
}
