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