export const validateEmail = (value: string): string => {
  const emailRegex = /^[^@]+@[^@]+\.[^@]{2,}$/
  if (!emailRegex.test(value)) return 'E-mail inválido.'
  return ''
}

export const validateLoginPassword = (value: string) => {
  if (!value.trim()) return 'Senha é obrigatória.'
  return ''
}