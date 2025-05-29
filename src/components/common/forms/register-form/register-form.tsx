import { FC, useEffect, useState } from 'react'
import styles from './register-form.module.css'
import { Logo } from '@/assets'
import { Button, Input } from '@/components'
import { useAuth, useNavigate } from '@/hooks'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from '@/utils/validators'

const RegisterForm: FC = () => {
  const { navigate } = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [formSuccess, setFormSuccess] = useState('')
  const [formValid, setFormValid] = useState(false)

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return validateName(value)
      case 'email':
        return validateEmail(value)
      case 'password':
        return validatePassword(value)
      case 'confirmPassword':
        return validateConfirmPassword(value, formData.password)
      default:
        return ''
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  useEffect(() => {
    if (formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
      }))
    }

    const noErrors = Object.values(errors).every((err) => err === '')
    const allFilled = Object.values(formData).every((val) => val.trim() !== '')

    setFormValid(noErrors && allFilled)
  }, [formData, errors])

  const handleSubmit = async () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some((err) => err !== '')) return

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })

    if (result) {
      setFormSuccess('')
      setErrors((prev) => ({ ...prev, email: result }))
    } else {
      setFormSuccess('Usuário cadastrado com sucesso!')
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      setErrors({ name: '', email: '', password: '', confirmPassword: '' })
    }
  }

  return (
    <div className={styles.formContainer}>
      <img src={Logo} className={styles.logo} />
      {!formSuccess && (
        <>
          <p>Preencha os dados abaixo para realizar seu cadastro:</p>
          <Input
            label='nome'
            placeholder='Seu nome aqui'
            type='text'
            value={formData.name}
            onChange={(e) => handleChange('name', e)}
            onBlur={() => setErrors((prev) => ({ ...prev, name: validateName(formData.name) }))}
            error={errors.name}
          />
          <Input
            label='e-mail'
            placeholder='Seu melhor e-mail aqui'
            type='email'
            value={formData.email}
            onChange={(e) => handleChange('email', e)}
            onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(formData.email) }))}
            error={errors.email}
          />
          <Input
            label='senha'
            type='password'
            value={formData.password}
            onChange={(e) => handleChange('password', e)}
            onBlur={() =>
              setErrors((prev) => ({ ...prev, password: validatePassword(formData.password) }))
            }
            error={errors.password}
          />
          <Input
            label='confirmar senha'
            type='password'
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e)}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirmPassword(
                  formData.confirmPassword,
                  formData.password
                )
              }))
            }
            error={errors.confirmPassword}
          />
        </>
      )}
      {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}

      {formSuccess && <p className={styles.successMessage}>{formSuccess}</p>}
      {!formSuccess && (
        <Button disabled={!formValid} onClick={handleSubmit}>
          Cadastrar
        </Button>
      )}
      <Button variant='outlined' onClick={() => navigate('/login')}>
        Voltar ao Login
      </Button>
    </div>
  )
}

export default RegisterForm
