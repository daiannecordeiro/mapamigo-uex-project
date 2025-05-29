import { FC, useState } from 'react'
import styles from './login-form.module.css'
import { Logo } from '@/assets'
import { Button, Input } from '@/components'
import { useAuth, useNavigate } from '@/hooks'
import { validateEmail, validateLoginPassword } from '@/utils'

const LoginForm: FC = () => {
  const { navigate } = useNavigate()
  const auth = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    login: ''
  })

  const validateFields = () => {
    const emailErr = validateEmail(email)
    const passwordErr = validateLoginPassword(password)

    setErrors({
      email: emailErr,
      password: passwordErr,
      login: ''
    })

    return !emailErr && !passwordErr
  }

  const handleLogin = async () => {
    if (!validateFields()) return

    const result = await auth.login(email, password)
    if (result) {
      setErrors((prev) => ({ ...prev, login: result }))
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className={styles.formContainer}>
      <img src={Logo} className={styles.logo} />
      <p>seu melhor gerenciador de contatos e endereços</p>

      <Input
        label='e-mail'
        type='email'
        placeholder='Digite seu e-mail'
        value={email}
        onChange={(val) => {
          setEmail(val)
          setErrors((prev) => ({ ...prev, email: '' }))
        }}
        onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
        error={errors.email}
      />

      <Input
        label='senha'
        type='password'
        placeholder='Digite sua senha'
        value={password}
        onChange={(val) => {
          setPassword(val)
          setErrors((prev) => ({ ...prev, password: '' }))
        }}
        onBlur={() =>
          setErrors((prev) => ({
            ...prev,
            password: validateLoginPassword(password)
          }))
        }
        error={errors.password}
      />

      {errors.login && <span className={styles.errorMessage}>{errors.login}</span>}

      <Button onClick={handleLogin}>Login</Button>

      <Button variant='outlined' onClick={() => navigate('/register')}>
        Criar Conta
      </Button>
    </div>
  )
}

export default LoginForm
