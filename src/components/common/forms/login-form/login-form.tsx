import { FC } from 'react'
import styles from './login-form.module.css'
import { Logo } from '@/assets'
import { Button, Input } from '@/components'
import { useAuth, useForm, useNavigate } from '@/hooks'
import { validateEmail, validateLoginPassword } from '@/utils'

const initialForm = {
  email: '',
  password: ''
}

const requiredFormFields: (keyof typeof initialForm)[] = ['email', 'password']

const validators = {
  email: validateEmail,
  password: validateLoginPassword
}

const maskers = {
  email: (value: string) => value.trim(),
  password: (value: string) => value.trim()
}

const LoginForm: FC = () => {
  const { navigate } = useNavigate()
  const auth = useAuth()

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErros = validateAll()
    const hasErrors = Object.values(newErros).some(Boolean)
    if (hasErrors) return

    try {
      const result = await auth.login(form.email, form.password)
      if (result) {
        setErrors((prev) => ({ ...prev, general: result }))
      } else {
        resetForm()
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <form className={styles.formContainer} onSubmit={handleLogin}>
      <img src={Logo} className={styles.logo} />
      <p>seu melhor gerenciador de contatos e endereços</p>

      <Input
        label='e-mail'
        type='email'
        placeholder='Digite seu e-mail'
        value={form.email}
        onChange={(v) => updateField('email', v)}
        error={errors.email}
        onBlur={() => handleBlur('email')}
      />

      <Input
        label='senha'
        type='password'
        placeholder='Digite sua senha'
        value={form.password}
        onChange={(v) => updateField('password', v)}
        error={errors.password}
        onBlur={() => handleBlur('password')}
      />

      {errors.general && <span className={styles.errorMessage}>{errors.general}</span>}

      <Button type="submit" disabled={!isFormValid}>
        Login
      </Button>

      <Button type='button' variant='outlined' onClick={() => navigate('/register')}>
        Criar Conta
      </Button>
    </form>
  )
}

export default LoginForm
