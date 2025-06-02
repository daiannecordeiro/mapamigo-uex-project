import { FC, useEffect, useMemo, useCallback, useState } from 'react'
import styles from './account-form.module.css'
import { Button, Dialog, Input, SnackBar } from '@/components'
import { useAuth, useNavigate, useForm } from '@/hooks'
import {
  capitalize,
  validateEmailInUse,
  validatePasswordChange,
  validateName,
  validatePassword
} from '@/utils'
import { isValidCredentials } from '@/services'

const AccountForm: FC = () => {
  const { user, update, deleteAccount } = useAuth()
  const { navigate } = useNavigate()

  const initialAccountValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }),
    [user]
  )

  const validators = {
    name: (value: string) => validateName(value),
    email: (value: string) => {
      const result = validateEmailInUse(
        JSON.parse(localStorage.getItem('mapamigo_users') || '[]'),
        value,
        user?.email || ''
      )
      return result ?? ''
    },
    newPassword: (value: string) => {
      if (value.trim()) {
        return validatePassword(value)
      }
      return ''
    },
    confirmPassword: (value: string): string => {
      if (values.newPassword.trim() && value !== values.newPassword) {
        return 'As senhas não coincidem.'
      }
      return ''
    }
  }

  const maskers = useMemo(
    () => ({
      name: capitalize,
      email: (value: string) => value.trim(),
      password: (value: string) => value.trim(),
      confirmPassword: (value: string) => value.trim()
    }),
    []
  )

  const { values, errors, updateField, setErrors, validateAll, setValues, handleBlur } = useForm(
    initialAccountValues,
    validators,
    maskers,
    ['name', 'email']
  )

  const [originalEmail, setOriginalEmail] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [success, setSuccess] = useState('')
  const [passwordToDelete, setPasswordToDelete] = useState('')

  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,
        name: user.name,
        email: user.email
      }))
      setOriginalEmail(user.email)
    }
  }, [user, setValues])

  const isPasswordChangeAttempted = useMemo(() => {
    const { currentPassword, newPassword, confirmPassword } = values
    return !!(currentPassword || newPassword || confirmPassword)
  }, [values])

  const isSaveDisabled = useMemo(() => {
    const nameUnchanged = values.name.trim() === user?.name
    const emailUnchanged = values.email.trim() === originalEmail
    const nameEmpty = values.name.trim() === ''
    const emailEmpty = values.email.trim() === ''
    return (
      (nameUnchanged && emailUnchanged && !isPasswordChangeAttempted) || nameEmpty || emailEmpty
    )
  }, [values, user?.name, originalEmail, isPasswordChangeAttempted])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrors((prev) => ({ ...prev, general: '' }))
      setSuccess('')

      const validationErrors = validateAll()
      const newErrors: typeof validationErrors = { ...validationErrors }

      const { name, email, currentPassword, newPassword, confirmPassword } = values

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

      const hasError = Object.values(newErrors).some((v) => v !== '')
      if (hasError) {
        setErrors(newErrors)
        return
      }

      const updatedPassword = isPasswordChangeAttempted ? newPassword : user?.password ?? ''
      const error = await update({ name, email, password: updatedPassword })

      if (error) {
        setErrors((prev) => ({ ...prev, general: error }))
        return
      }

      setSuccess('Alterações salvas com sucesso!')
      setOriginalEmail(email)

      setValues((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    },
    [
      values,
      isPasswordChangeAttempted,
      originalEmail,
      update,
      user,
      validateAll,
      setErrors,
      setValues
    ]
  )

  const handleDelete = useCallback(async () => {
    if (passwordToDelete && !isValidCredentials(originalEmail, passwordToDelete)) {
      setErrors((prev) => ({
        ...prev,
        general: 'A senha atual está incorreta.'
      }))
      return
    }
    await deleteAccount()
    navigate('/login')
  }, [deleteAccount, navigate, originalEmail, passwordToDelete, setErrors])

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Minha Conta</h2>

      <div className={styles.inputGroup}>
        <Input
          label='Nome'
          value={values.name}
          onChange={(v) => updateField('name', v)}
          error={errors.name}
          onBlur={() => handleBlur('name')}
        />
        <Input
          label='E-mail'
          type='email'
          value={values.email}
          onChange={(v) => updateField('email', v)}
          error={errors.email}
          onBlur={() => handleBlur('email')}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label='Senha atual'
          type='password'
          value={values.currentPassword}
          onChange={(v) => updateField('currentPassword', v)}
          error={errors.currentPassword}
        />
        <Input
          label='Nova senha'
          type='password'
          value={values.newPassword}
          onChange={(v) => updateField('newPassword', v)}
          error={errors.newPassword}
          onBlur={() => handleBlur('newPassword')}
        />
        <Input
          label='Confirmar nova senha'
          type='password'
          value={values.confirmPassword}
          onChange={(v) => updateField('confirmPassword', v)}
          error={errors.confirmPassword}
          onBlur={() => handleBlur('confirmPassword')}
        />
      </div>

      {errors.general && (
        <SnackBar
          message={errors.general ?? ''}
          open={!!errors.general}
          variant='danger'
          onClose={() => setErrors((prev) => ({ ...prev, general: '' }))}
        />
      )}
      {success && (
        <SnackBar
          message={success}
          open={!!success}
          variant='success'
          onClose={() => setSuccess('')}
        />
      )}

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
        onCancel={() => setOpenDialog(false)}
        onConfirm={handleDelete}
        children={
          <>
            <p>Tem certeza de que deseja excluir sua conta? Essa ação não poderá ser desfeita.</p>
            <Input
              label='Digite sua senha para confirmar'
              type='password'
              value={passwordToDelete}
              onChange={(v) => setPasswordToDelete(v)}
              error={passwordToDelete && passwordToDelete.trim() === '' ? 'Campo obrigatório' : ''}
            />
          </>
        }
      />
    </form>
  )
}

export default AccountForm
