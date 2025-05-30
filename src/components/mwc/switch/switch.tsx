/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { FC } from 'react'
import '@material/web/switch/switch'
import '@material/web/icon/icon'
import styles from './switch.module.css'

interface SwitchProps {
  value: 'asc' | 'desc'
  onChange: (value: 'asc' | 'desc') => void
}

const Switch: FC<SwitchProps> = ({ value, onChange }) => {
  const isAsc = value === 'asc'

  const handleToggle = () => {
    onChange(isAsc ? 'desc' : 'asc')
  }

  return (
    <div className={styles.wrapper}>
      <md-icon>{isAsc ? 'arrow_upward' : 'arrow_downward'}</md-icon>
      <p>
        Organizar: <span>{isAsc ? 'A-Z' : 'Z-A'}</span>{' '}
      </p>

      <md-switch selected={!isAsc} onChange={handleToggle} />
    </div>
  )
}

export default Switch
