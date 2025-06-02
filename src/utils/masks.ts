// Máscara de CPF
export const maskCpf = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

// Máscara de Telefone fixo ou celular
export const maskPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);

  if (cleaned.length <= 10) {
    return cleaned
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  } else {
    return cleaned
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  }
};

// Máscara de CEP
export const maskCep = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2')