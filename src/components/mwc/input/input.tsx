/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { FC } from 'react';
import '@material/web/textfield/outlined-text-field';
import styles from './input.module.css';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  maxlength?: number;
}

const InputField: FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  loading = false,  
  maxlength,
}) => {
  return (
    <div className={styles.container}>
      <md-outlined-text-field
        label={label}
        placeholder={placeholder}
        type={type}
        value={value}
        onInput={(e: Event) => onChange((e.target as HTMLInputElement).value)}
        onBlur={onBlur}
        error={error && error !== ''}
        supportingText={error}
        classname={styles.input}
        disabled={disabled}
        loading={loading}
        maxlength={maxlength}
      ></md-outlined-text-field>
    </div>
  );
};

export default InputField;
