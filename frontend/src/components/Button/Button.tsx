import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  className,
  color = 'green',
  ...props
}: ButtonProps) => {
  return (
    <>
      <button
        className={className ?? `${styles.button} ${styles[color]}`}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
