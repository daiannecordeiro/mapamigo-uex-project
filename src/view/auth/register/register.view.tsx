import { FC } from 'react'
import styles from '../auth.module.css'
import { MapImageBoy } from '@/assets'
import { RegisterForm } from '@/components'

const Register: FC = () => {
  return (
    <div className={styles.container}>
      <img src={MapImageBoy} className={styles.illustration} />
      <RegisterForm />
    </div>
  )
}

export default Register
