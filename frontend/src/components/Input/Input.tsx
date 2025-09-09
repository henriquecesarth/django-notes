import React from 'react';
import styles from './Input.module.css';

type InputProps = {
  id: string;
  labelText?: string;
  labelClassName?: string;
} & React.ComponentProps<'input'>;

const Input = ({
  id,
  labelText,
  type,
  value,
  onChange,
  className,
  labelClassName,
  ...rest
}: InputProps) => {
  return (
    <>
      {labelText && (
        <label className={labelClassName} htmlFor={id}>
          {labelText}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        className={className ?? styles.input}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </>
  );
};

export default Input;
