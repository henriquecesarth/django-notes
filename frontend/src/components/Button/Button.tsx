import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, type, className, ...props }: ButtonProps) => {
  return (
    <>
      <button className={className ?? styles.button} type={type} {...props}>
        {children}
      </button>
    </>
  );
};

export default Button;
