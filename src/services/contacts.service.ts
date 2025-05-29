const STORAGE_KEY_PREFIX = 'contacts_';

export interface IContact {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function getContacts(userId: string): IContact[] {
  return JSON.parse(localStorage.getItem(getStorageKey(userId)) || '[]');
}

function saveContacts(userId: string, contacts: IContact[]) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(contacts));
}

// CREATE
export function createContact(userId: string, contact: IContact) {
  const contacts = getContacts(userId);

  if (contacts.find(c => c.cpf === contact.cpf)) {
    return;
  }

  contacts.push(contact);
  saveContacts(userId, contacts);
}

// READ (todos)
export function getAllContacts(userId: string): IContact[] {
  return getContacts(userId);
}

// READ (por id)
export function getContactById(userId: string, id: string): IContact | undefined {
  return getContacts(userId).find(contact => contact.id === id);
}

// READ (por CPF)
export function getContactByCpf(userId: string, cpf: string): IContact | undefined {
  return getContacts(userId).find(contact => contact.cpf === cpf);
}

// UPDATE
export function updateContact(userId: string, id: string, updatedData: Partial<IContact>) {
  const contacts = getContacts(userId);
  const index = contacts.findIndex(c => c.id === id);

  if (index === -1) {
    throw new Error('Contato não encontrado');
  }

  if (
    updatedData.cpf &&
    contacts.some((c, i) => c.cpf === updatedData.cpf && i !== index)
  ) {
    throw new Error('Outro contato já possui este CPF');
  }

  contacts[index] = { ...contacts[index], ...updatedData };
  saveContacts(userId, contacts);
}

// DELETE
export function deleteContact(userId: string, id: string) {
  const contacts = getContacts(userId);
  const filtered = contacts.filter(contact => contact.id !== id);
  saveContacts(userId, filtered);
}

// DELETE ALL CONTACTS
export function deleteAllContacts(userId: string) {
  localStorage.removeItem(getStorageKey(userId));
}