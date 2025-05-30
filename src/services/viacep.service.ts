import axios from 'axios'

export const fetchAddressByCEP = async (cep: string) => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

  if (data.erro) throw new Error('CEP não encontrado')
  return data
}