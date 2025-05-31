import { FC, useState } from 'react'
import styles from './sidebar.module.css'
import { Input, Button, List, Switch, IconButton } from '@/components'
import { useAuth, useContacts } from '@/hooks'

interface SidebarProps {
  onSelectContact: (id: string) => void
  onNewContact: () => void
  isOpen: boolean
  onClose: () => void
}

const Sidebar: FC<SidebarProps> = ({ onSelectContact, onNewContact, isOpen, onClose }) => {
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const { user } = useAuth()
  const { contacts } = useContacts(user?.email || 'anon')

  const filtered = (contacts || [])
    .filter((contact) => {
      const searchLower = search.toLowerCase()
      return (
        contact.name.toLowerCase().includes(searchLower) ||
        contact.cpf.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      if (order === 'asc') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.closeButton}>
        <h2>Contatos</h2>
        <IconButton variant='default' icon='close' onClick={onClose} />
      </div>
      <Input
        label='Buscar contato'
        value={search}
        onChange={(value) => setSearch(value)}
        placeholder='Digite um nome ou cpf'
      />
      <Switch value={order} onChange={setOrder} />
      <List contacts={filtered} onSelect={onSelectContact} />
      <div className={styles.buttonContainer}>
        <Button onClick={onNewContact}>Novo Contato</Button>
      </div>
    </aside>
  )
}

export default Sidebar
