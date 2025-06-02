import { isValidCredentials, User } from "@/services"

// Validador básico de campo obrigatório
export const validateNotEmpty = (value: string): string =>
  value.trim() === '' ? 'Campo obrigatório' : ''

// Validador campo de Nome
export const validateName = (value: string): string => {
  if (!value.trim()) return 'O nome é obrigatório.'
  return ''
}

// Validador campo de E-mail
export const validateEmail = (value: string): string => {
  const emailRegex = /^[^@]+@[^@]+\.[^@]{2,}$/
  if (!emailRegex.test(value)) return 'E-mail inválido.'
  return ''
}

// Validador campo de Senha
export const validatePassword = (value: string): string => {
  if (!value.trim()) return 'A senha é obrigatória.'
  if (value.length < 6) return 'A senha deve ter no mínimo 6 caracteres.'
  return ''
}

// Validador campo de Login (Senha)
export const validateLoginPassword = (value: string) => {
  if (!value.trim()) return 'Senha é obrigatória.'
  return ''
}

// Validador campo de Confirmação de Senha
export const validateConfirmPassword = (
  value: string,
  password: string
): string => {
  if (!value.trim()) return 'Confirme sua senha.'
  if (value !== password) return 'As senhas não coincidem.'
  return ''
}

// Validador de E-mail em uso
export const validateEmailInUse = (
  users: User[],
  email: string,
  originalEmail: string
): string | null => {
  if (!email) return 'O e-mail é obrigatório.'

  const emailInUse = users.some((u) => u.email === email && u.email !== originalEmail)
  if (emailInUse) {
    return 'Este e-mail já está em uso por outra conta.'
  }

  const emailRegex = /^[^@]+@[^@]+\.[^@]{2,}$/
  if (!emailRegex.test(email)) return 'E-mail inválido.'

  return null
}

// Validador de Senha para alteração de senha
export const validatePasswordChange = (
  originalEmail: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): string | null => {


  if (!currentPassword || !newPassword || !confirmPassword) {
    return 'Preencha todos os campos de senha para alterar a senha.'
  }

  if (!isValidCredentials(originalEmail, currentPassword)) {
    return 'A senha atual está incorreta.'
  }

  if (newPassword.length < 6) return 'A senha deve ter no mínimo 6 caracteres.'


  if (newPassword !== confirmPassword) {
    return 'A nova senha e a confirmação não coincidem.'
  }

  return null
}

// Validador de CPF
export const validateCpf = (cpf: string): string => {
  const cleanCpf = cpf.replace(/\D/g, '')
  if (!/^\d{11}$/.test(cleanCpf)) return 'CPF inválido'

  const isValid = (cpf: string): boolean => {
    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++)
      sum += parseInt(cpf[i - 1]) * (11 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf[9])) return false

    sum = 0
    for (let i = 1; i <= 10; i++)
      sum += parseInt(cpf[i - 1]) * (12 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf[10])) return false

    return true
  }

  return isValid(cleanCpf) ? '' : 'CPF inválido'
}

// Validador de Estado (UF)
export const validateUF = (value: string): string =>
  /^[A-Z]{2}$/.test(value.toUpperCase()) ? '' : 'UF inválida (ex: RJ)'

// Validador de CEP
export const validateCepFormat = (value: string): string =>
  /^\d{5}-?\d{3}$/.test(value) ? '' : 'CEP inválido'

// Validador de Telefone
export const validatePhone = (value: string): string =>
  /^\(\d{2}\) (9\d{4}|\d{4})-\d{4}$/.test(value) ? '' : 'Telefone inválido';
