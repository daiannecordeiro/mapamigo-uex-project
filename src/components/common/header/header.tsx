import { FC } from 'react'
import styles from './header.module.css'
import { Logo, Icon } from '@/assets'
import { Button, IconButton } from '@/components'

interface HeaderProps {
  onAccount: () => void
  onLogout: () => void
  onMenuClick?: () => void
}

const Header: FC<HeaderProps> = ({ onAccount, onLogout, onMenuClick }) => {
  return (
    <header className={styles.header}>
      <img src={Logo} alt='Mapamigo' className={styles.logo} />
      <img src={Icon} alt='Mapamigo' className={styles.logoIcon} />
      <div className={styles.actions}>
        <Button variant='text' icon='account_circle' onClick={onAccount}>
          Minha Conta
        </Button>
        <Button variant='text' icon='logout' className='logoutButton' onClick={onLogout}>
          Sair
        </Button>
      </div>
      <div className={styles.mobileMenu}>
        <IconButton variant='default' icon='account_circle' onClick={onAccount} />
        <IconButton variant='default' icon='logout' onClick={onLogout} />
        <IconButton variant='default' icon='menu' onClick={onMenuClick} />
      </div>
    </header>
  )
}

export default Header
