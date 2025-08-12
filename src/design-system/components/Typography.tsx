import React from 'react';
import styles from './Typography.module.css';
import { classNames } from '@/utils/classNames';

type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  variant?: 'heading' | 'body' | 'caption';
  as?: keyof JSX.IntrinsicElements;
};

export function Typography({
  variant = 'body',
  as: Component = 'p',
  className,
  ...props
}: TypographyProps) {
  const Tag = Component as keyof JSX.IntrinsicElements;
  const classes = classNames(styles[variant], className);
  return React.createElement(Tag, { ...props, className: classes });
}
