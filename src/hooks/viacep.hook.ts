import useSWR from 'swr'
import { fetchAddressByCEP } from '@/services/viacep.service'

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
