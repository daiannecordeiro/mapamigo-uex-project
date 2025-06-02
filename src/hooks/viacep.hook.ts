import useSWR from 'swr'
import { fetchAddressByCEP } from '@/services/viacep.service'

// Esse hook é usado para buscar o endereço a partir do CEP usando a API ViaCEP.

export const useCEP = (cep: string) => {
  const shouldFetch = cep.length === 8
  const { data, error, isLoading } = useSWR(shouldFetch ? cep : null, fetchAddressByCEP)

  return {
    address: data,
    isLoading,
    isError: !!error,
    errorMessage: error?.message
  }
}
