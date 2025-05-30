import { isValidCredentials, User } from "@/services"

export const validateEmail = (value: string): string => {
  const emailRegex = /^[^@]+@[^@]+\.[^@]{2,}$/
  if (!emailRegex.test(value)) return 'E-mail inválido.'
  return ''
}

export const validateLoginPassword = (value: string) => {
  if (!value.trim()) return 'Senha é obrigatória.'
  return ''
}

export const validateName = (value: string): string => {
  if (!value.trim()) return 'O nome é obrigatório.'
  return ''
}

export const validatePassword = (value: string): string => {
  if (!value.trim()) return 'A senha é obrigatória.'
  if (value.length < 6) return 'A senha deve ter no mínimo 6 caracteres.'
  return ''
}

export const validateConfirmPassword = (
  value: string,
  password: string
): string => {
  if (!value.trim()) return 'Confirme sua senha.'
  if (value !== password) return 'As senhas não coincidem.'
  return ''
}

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