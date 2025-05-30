/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import '@material/web/dialog/dialog'
import { FC, useRef } from 'react'
import styles from './dialog.module.css'
import  { Button } from '@/components'

interface DialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const Dialog: FC<DialogProps> = ({ open, title, message, onConfirm, onCancel }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  return (
    <md-dialog open={open} ref={dialogRef} className={styles.dialog}>
      <div slot='headline' className={styles.headline}>
        {title}
      </div>
      <div slot='content' className={styles.content}>
        {message}
      </div>
      <div slot='actions' className={styles.actions}>
        <Button variant='outlined' type='button' onClick={onCancel} className={styles.cancel}>
          Cancelar
        </Button>
        <Button variant='filled' type='button' onClick={onConfirm} className={styles.danger}>
          Confirmar
        </Button>
      </div>
    </md-dialog>
  )
}

export default Dialog
