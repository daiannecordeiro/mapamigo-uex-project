/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { FC } from 'react'
import { IContact } from '@/services'
import styles from './list.module.css'

interface IListProps {
  contacts: IContact[]
  onSelect: (id: string) => void
}

const List: FC<IListProps> = ({ contacts, onSelect }) => {
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

export default List
