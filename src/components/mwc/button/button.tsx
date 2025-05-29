/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { FC, ReactNode } from 'react'
import styles from './button.module.css'
import '@material/web/button/filled-button'
import '@material/web/button/outlined-button'
import '@material/web/button/text-button'

interface IButtonProps {
  variant?: 'filled' | 'outlined' | 'text'
  onClick?: () => void
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  icon?: string
  className?: string
}

const Button: FC<IButtonProps> = ({
  variant = 'filled',
  onClick,
  children,
  type = 'button',
  disabled = false,
  icon,
}) => {
  const Tag =
    variant === 'outlined'
      ? 'md-outlined-button'
      : variant === 'text'
      ? 'md-text-button'
      : 'md-filled-button'

  return (
    <Tag
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${styles.button}`}
    >
      {icon && <md-icon slot='icon'>{icon}</md-icon>}
      {children}
    </Tag>
  )
}

export default Button
