import { useEffect, useState } from 'react'
import styles from './snackbar.module.css'

type Props = {
  message: string
  open: boolean
  duration?: number
  variant?: 'success' | 'danger' | 'default'
  onClose?: () => void
}

export default function SnackBar({
  message,
  open,
  duration = 4000,
  variant = 'default',
  onClose
}: Props) {
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [open, duration, onClose])

  return visible ? (
    <div className={`${styles.snackbar} ${styles[variant]}`} role="status">
      {message}
    </div>
  ) : null
}
