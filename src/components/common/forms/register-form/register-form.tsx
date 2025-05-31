import { FC, useState } from 'react'
import styles from './register-form.module.css'
import { Logo } from '@/assets'
import { Button, Input, SnackBar } from '@/components'
import { useAuth, useForm, useNavigate } from '@/hooks'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  capitalize
} from '@/utils'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const requiredFormFields: (keyof typeof initialForm)[] = [
  'name',
  'email',
  'password',
  'confirmPassword'
]

const maskers = {
  name: capitalize,
  email: (value: string) => value.trim(),
  password: (value: string) => value.trim(),
  confirmPassword: (value: string) => value.trim()
}

const RegisterForm: FC = () => {
  const { navigate } = useNavigate()
  const { register } = useAuth()

  const [success, setSuccess] = useState('')

  const validators = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    confirmPassword: (value: string): string => validateConfirmPassword(value, form.password)
  }
  const {
    values: form,
    errors,
    updateField,
    validateAll,
    resetForm,
    setErrors,
    isFormValid,
    handleBlur
  } = useForm(initialForm, validators, maskers, requiredFormFields)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErros = validateAll()
    const hasErrors = Object.values(newErros).some(Boolean)
    if (hasErrors) return

    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password
      })

      if (!result) {
        setErrors((prev) => ({ ...prev, general: 'Erro ao cadastrar usuário. Tente novamente.' }))
        return
      }

      setSuccess('Cadastro realizado com sucesso!')
      resetForm()
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      setErrors((prev) => ({ ...prev, general: 'Erro ao cadastrar usuário. Tente novamente.' }))
    }
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <img src={Logo} className={styles.logo} />
      {!success && (
        <>
          <p>Preencha os dados abaixo para realizar seu cadastro:</p>
          <Input
            label='nome'
            placeholder='Seu nome aqui'
            type='text'
            value={form.name}
            onChange={(v) => updateField('name', v)}
            onBlur={() => handleBlur('name')}
            error={errors.name}
          />
          <Input
            label='e-mail'
            placeholder='Seu melhor e-mail aqui'
            type='email'
            value={form.email}
            onChange={(v) => updateField('email', v)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
          />
          <Input
            label='senha'
            type='password'
            value={form.password}
            onChange={(e) => updateField('password', e)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
          />
          <Input
            label='confirmar senha'
            type='password'
            value={form.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e)}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
          />
        </>
      )}
      {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}

      {success && <p className={styles.successMessage}>{success}</p>}
      {!success && (
        <Button type='submit' disabled={!isFormValid}>
          Cadastrar
        </Button>
      )}
      <Button type='button' variant='outlined' onClick={() => navigate('/login')}>
        Voltar ao Login
      </Button>

      <SnackBar
        message={errors.general}
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
    </form>
  )
}

export default RegisterForm
