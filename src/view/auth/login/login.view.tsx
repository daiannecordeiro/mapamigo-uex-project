import { FC } from 'react'
import styles from '@/view/auth/auth.module.css'
import { MapImageBoy } from '@/assets'
import { LoginForm } from '@/components'

const Login: FC = () => {
  return (
    <div className={styles.container}>
      <img src={MapImageBoy} className={styles.illustration} />
      <LoginForm />
    </div>
  )
}

export default Login
