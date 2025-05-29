import { FC } from 'react'
import styles from './not-found.module.css'
import { NotFoundImage } from '@/assets'
import { useNavigate } from '@/hooks'
import { Button } from '@/components'

const NotFound: FC = () => {
  const { navigate } = useNavigate()
  const handleReturn = () => {
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Página não encontrada</h1>
      <img className={styles.image} src={NotFoundImage} alt='Página não encontrada' />
      <p className={styles.message}>A página que você está procurando não existe.</p>
      <div className={styles.buttonContainer}>
        <Button variant='filled' onClick={handleReturn} type='button'>
          Ir para Login
        </Button>
      </div>
    </div>
  )
}

export default NotFound
