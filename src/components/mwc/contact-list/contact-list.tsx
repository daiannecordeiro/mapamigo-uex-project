/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { FC } from 'react'
import { IContact } from '@/services'
import styles from './contact-list.module.css'

interface IContactListProps {
  contacts: IContact[]
  onSelect: (id: string) => void
}

const ContactList: FC<IContactListProps> = ({ contacts, onSelect }) => {
  return (
    <md-list>
      {contacts.map((contact) => (
        <md-list-item key={contact.id} onClick={() => onSelect(contact.id)}>
            <div className={styles.contact}>
              <p className={styles.title}>{contact.name}</p>
              <span className={styles.subtitle}>{contact.cpf}</span>
            </div>
        </md-list-item>
      ))}
    </md-list>
  )
}

export default ContactList
