import React from "react";
import styles from "./Button.module.css";
import { classNames } from "@/utils/classNames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const classes = classNames(styles.button, styles[variant], className);
  return <button {...props} className={classes} />;
}
