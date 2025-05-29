import { deleteAllContacts } from './contacts.service';

export type User = {
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = 'mapamigo_users';
const CURRENT_USER_KEY = 'mapamigo_current_user';

// READ: retorna todos os usuários cadastrados
export function getUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// WRITE: salva todos os usuários
function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// CREATE: registra um novo usuário
export function createUser(newUser: User): string | null {
  const users = getUsers();
  const exists = users.some((user) => user.email === newUser.email);
  if (exists) return 'E-mail já cadastrado.';

  users.push(newUser);
  saveUsers(users);
  return null;
}

// READ: retorna o usuário logado atualmente
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// UPDATE: atualiza dados do usuário logado
export function updateCurrentUser(updatedData: Partial<User>): string | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return 'Nenhum usuário logado.';

  const users = getUsers();
  const index = users.findIndex((u) => u.email === currentUser.email);
  if (index === -1) return 'Usuário não encontrado.';

  const updatedUser = { ...users[index], ...updatedData };
  users[index] = updatedUser;

  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  return null;
}

// DELETE: remove conta do usuário logado
export function deleteAccount(): string | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return 'Nenhum usuário logado.';

  const updatedUsers = getUsers().filter((u) => u.email !== currentUser.email);
  saveUsers(updatedUsers);
  deleteAllContacts(currentUser.email);
  logout();
  return null;
}

// LOGIN: autentica usuário e salva na sessão
export function login(email: string, password: string): string | null {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return 'E-mail ou senha inválidos.';

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return null;
}

// LOGOUT: remove usuário logado da sessão
export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// HELPER: valida se as credenciais existem
export function isValidCredentials(email: string, password: string): boolean {
  const users = getUsers();
  return users.some((u) => u.email === email && u.password === password);
}