import { FC, useEffect, useState } from 'react'
import styles from './main-panel.module.css'
import { AccountForm, NewContactForm, ContactDetail, EditContactForm } from '@/components'
import { MapImageGirl } from '@/assets'
import { useAuth, useContacts } from '@/hooks'

interface MainPanelProps {
  activeView: 'map' | 'new' | 'account'
  selectedContactId: string | null
}

const MainPanel: FC<MainPanelProps> = ({ activeView, selectedContactId }) => {
  const { user } = useAuth()
  const { contacts } = useContacts(user?.email || 'anon')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setIsEditing(false)
  }, [selectedContactId])

  if (activeView === 'account') {
    return <AccountForm />
  }

  if (activeView === 'new') {
    return <NewContactForm />
  }

  const selectedContact = contacts?.find((contact) => contact.id === selectedContactId)

  return (
    <div className={styles.panel}>
      {selectedContact ? (
        isEditing ? (
          <EditContactForm
            contact={selectedContact}
            onCancel={() => setIsEditing(false)}
            onSubmit={() => setIsEditing(false)}
          />
        ) : (
          <ContactDetail contact={selectedContact} onEdit={() => setIsEditing(true)} />
        )
      ) : (
        <>
          <h2 className={styles.title}>Selecione um contato para visualizar o mapa</h2>
          <img className={styles.illustration} src={MapImageGirl} />
        </>
      )}
    </div>
  )
}

export default MainPanel
