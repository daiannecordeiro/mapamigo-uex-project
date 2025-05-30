/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { FC } from 'react'
import styles from './icon-button.module.css'

interface IIconButtonProps {
  variant?: 'filled' | 'outlined' | 'default'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  icon?: string
  className?: string
}

const IconButton: FC<IIconButtonProps> = ({
  variant = 'default',
  onClick,
  type = 'button',
  disabled = false,
  icon
}) => {
  const Tag =
    variant === 'outlined'
      ? 'md-outlined-icon-button'
      : variant === 'filled'
      ? 'md-filled-icon-button'
      : 'md-icon-button'

  return (
    <Tag onClick={onClick} type={type} disabled={disabled} className={`${styles.button}`}>
      {icon && <md-icon slot='icon'>{icon}</md-icon>}
    </Tag>
  )
}

export default IconButton
