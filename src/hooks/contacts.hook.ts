import useSWR from 'swr';
import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
  IContact
} from '@/services/contacts.service';

export function useContacts(userId: string) {
  const key = `contacts_${userId}`;

  const { data: contacts = [], mutate, error, isLoading } = useSWR<IContact[]>(key, () => {
    return Promise.resolve(getAllContacts(userId));
  });

  const addContact = async (contact: IContact) => {
    await createContact(userId, contact);
    await mutate();
  };

  const editContact = async (id: string, updatedData: Partial<IContact>) => {
    await updateContact(userId, id, updatedData);
    await mutate();
  };

  const removeContact = async (id: string) => {
    await deleteContact(userId, id);
    await mutate();
  };

  return {
    contacts,
    isLoading,
    error,
    addContact,
    editContact,
    removeContact,
    refresh: mutate,
  };
}
