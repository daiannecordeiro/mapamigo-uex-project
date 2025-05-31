import { FC, useState } from 'react'
import styles from './dashboard.module.css'
import { Header, Sidebar, MainPanel } from '@/components'
import { logout } from '@/services'
import { useNavigate } from '@/hooks'

const Dashboard: FC = () => {
  const { navigate } = useNavigate()
  const [activeView, setActiveView] = useState<'map' | 'new' | 'account'>('map')
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.dashboard}>
      <Header
        onAccount={() => setActiveView('account')}
        onLogout={handleLogout}
        onMenuClick={() => setIsSidebarOpen(true)} // Novo prop
      />
      <div className={styles.body}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectContact={(id: string) => {
            setSelectedContactId(id)
            setActiveView('map')
            setIsSidebarOpen(false)
          }}
          onNewContact={() => {
            setActiveView('new')
            setIsSidebarOpen(false)
          }}
        />
        <MainPanel activeView={activeView} selectedContactId={selectedContactId} />
      </div>
    </div>
  )
}

export default Dashboard
