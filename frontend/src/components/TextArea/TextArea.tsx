import React from 'react';
import styles from './TextArea.module.css';

type TextAreaProps = {
  id: string;
  labelText?: string;
  labelClassName?: string;
} & React.ComponentProps<'textarea'>;

const TextArea = ({
  id,
  labelText,
  value,
  onChange,
  className,
  labelClassName,
  ...rest
}: TextAreaProps) => {
  return (
    <>
      {labelText && (
        <label className={labelClassName} htmlFor={id}>
          {labelText}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        className={className ?? styles.textArea}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </>
  );
};

export default TextArea;
