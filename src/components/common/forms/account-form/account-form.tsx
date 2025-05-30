import { FC, useEffect, useMemo, useState, useCallback } from 'react'
import styles from './account-form.module.css'
import { Button, Dialog, Input, SnackBar } from '@/components'
import { useAuth, useNavigate } from '@/hooks'
import { validateEmailInUse, validatePasswordChange } from '@/utils'

const AccountForm: FC = () => {
  const { user, update, deleteAccount } = useAuth()
  const { navigate } = useNavigate()

  const [openDialog, setOpenDialog] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [originalEmail, setOriginalEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email
      }))
      setOriginalEmail(user.email)
    }
  }, [user])

  const isPasswordChangeAttempted = useMemo(() => {
    const { currentPassword, newPassword, confirmPassword } = formData
    return !!(currentPassword || newPassword || confirmPassword)
  }, [formData])

  const isSaveDisabled = useMemo(() => {
    const nameUnchanged = formData.name.trim() === user?.name
    const emailUnchanged = formData.email.trim() === originalEmail
    const nameEmpty = formData.name.trim() === ''
    const emailEmpty = formData.email.trim() === ''
    return (
      (nameUnchanged && emailUnchanged && !isPasswordChangeAttempted) || nameEmpty || emailEmpty
    )
  }, [formData, user?.name, originalEmail, isPasswordChangeAttempted])

  const handleChange = useCallback((key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrors({})
      setSuccess('')

      const newErrors: Record<string, string> = {}
      const { name, email, currentPassword, newPassword, confirmPassword } = formData

      if (!name.trim()) newErrors.name = 'Nome é obrigatório.'
      if (!email.trim()) newErrors.email = 'E-mail é obrigatório.'

      const nameUnchanged = name === user?.name
      const emailUnchanged = email === originalEmail

      if (nameUnchanged && emailUnchanged && !isPasswordChangeAttempted) return

      if (user) {
        const users = JSON.parse(localStorage.getItem('mapamigo_users') || '[]')
        const emailError = validateEmailInUse(users, email, originalEmail)
        if (emailError) newErrors.email = emailError
      }

      if (isPasswordChangeAttempted) {
        if (user?.password !== currentPassword) {
          newErrors.currentPassword = 'A senha atual está incorreta.'
        } else {
          const passwordError = validatePasswordChange(
            originalEmail,
            currentPassword,
            newPassword,
            confirmPassword
          )
          if (passwordError) {
            if (passwordError.includes('nova senha')) newErrors.newPassword = passwordError
            else if (passwordError.includes('confirmar')) newErrors.confirmPassword = passwordError
            else newErrors.general = passwordError
          }
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      const updatedPassword = isPasswordChangeAttempted ? newPassword : user?.password ?? ''
      const error = await update({ name, email, password: updatedPassword })

      if (error) {
        setErrors({ general: error })
        return
      }

      setSuccess('Alterações salvas com sucesso!')
      setOriginalEmail(email)
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    },
    [formData, isPasswordChangeAttempted, originalEmail, update, user]
  )

  const handleDelete = useCallback(async () => {
    await deleteAccount()
    navigate('/login')
  }, [deleteAccount, navigate])

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Minha Conta</h2>

      <div className={styles.inputGroup}>
        <Input
          label='Nome'
          value={formData.name}
          onChange={(v) => handleChange('name', v)}
          error={errors.name}
        />
        <Input
          label='E-mail'
          type='email'
          value={formData.email}
          onChange={(v) => handleChange('email', v)}
          error={errors.email}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label='Senha atual'
          type='password'
          value={formData.currentPassword}
          onChange={(v) => handleChange('currentPassword', v)}
          error={errors.currentPassword}
        />
        <Input
          label='Nova senha'
          type='password'
          value={formData.newPassword}
          onChange={(v) => handleChange('newPassword', v)}
          error={errors.newPassword}
        />
        <Input
          label='Confirmar nova senha'
          type='password'
          value={formData.confirmPassword}
          onChange={(v) => handleChange('confirmPassword', v)}
          error={errors.confirmPassword}
        />
      </div>

      <SnackBar
        message={errors.general ?? ''}
        open={!!errors.general}
        variant='danger'
        onClose={() => setErrors((prev) => ({ ...prev, general: '' }))}
      />
      <SnackBar
        open={!!success}
        message={success}
        variant='success'
        onClose={() => setSuccess('')}
      />

      <div className={styles.buttonGroup}>
        <Button variant='outlined' onClick={() => setOpenDialog(true)} icon='delete'>
          Excluir Conta
        </Button>
        <Button type='submit' variant='filled' disabled={isSaveDisabled}>
          Salvar Alterações
        </Button>
      </div>

      <Dialog
        open={openDialog}
        title='Confirmar exclusão'
        message='Tem certeza de que deseja excluir sua conta? Essa ação não poderá ser desfeita.'
        onCancel={() => setOpenDialog(false)}
        onConfirm={handleDelete}
      />
    </form>
  )
}

export default AccountForm
