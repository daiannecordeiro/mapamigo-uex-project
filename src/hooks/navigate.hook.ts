import { useCallback, useEffect, useState } from 'react'
import {
  useNavigate as useNavigateRRD,
  useLocation,
} from 'react-router-dom'

// Esse hook é usado para encapsular a lógica de navegação e manter o caminho atual da aplicação.

export const useNavigate = () => {
  const router = useNavigateRRD()
  const location = useLocation()
  const [currPath, setCurrPath] = useState<string>('')

  const navigate = useCallback(
    (path: string) => {
      router(path)
    },
    [router]
  )

  useEffect(() => {
    setCurrPath(location.pathname)
  }, [location.pathname])

  return { currPath, navigate }
}

export default useNavigate
