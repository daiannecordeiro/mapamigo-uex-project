import { IContact } from '@/services/contacts.service'

export interface IContactDetail {
  contact: IContact
  onEdit: () => void
  onDeleteSuccess?: () => void
}