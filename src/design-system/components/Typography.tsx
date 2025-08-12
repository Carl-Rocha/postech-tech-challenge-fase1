import React from 'react';
import styles from './Typography.module.css';

type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  variant?: 'heading' | 'body' | 'caption';
  as?: keyof JSX.IntrinsicElements;
};

export function Typography({
  variant = 'body',
  as: Component = 'p',
  className = '',
  ...props
}: TypographyProps) {
  const Tag = Component as keyof JSX.IntrinsicElements;
  const classes = [styles[variant], className].join(' ').trim();
  return React.createElement(Tag, { className: classes, ...props });
}
