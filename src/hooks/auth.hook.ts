import useSWR from 'swr';
import {
  User,
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  createUser as createUserService,
  updateCurrentUser as updateUserService,
  deleteAccount as deleteAccountService,
} from '@/services/auth.service';

// Esse hook é usado para gerenciar a autenticação do usuário, permitindo login, logout, registro, atualização de dados e exclusão de conta.

const CURRENT_USER_KEY = 'mapamigo_current_user';

export function useAuth() {
  const { data: user, mutate, isLoading, error } = useSWR<User | null>(
    CURRENT_USER_KEY,
    () => Promise.resolve(getCurrentUser())
  );

  const login = async (email: string, password: string): Promise<string | null> => {
    const result = loginService(email, password);
    if (!result) {
      await mutate(); 
    }
    return result;
  };

  const logout = async () => {
    logoutService();
    await mutate(null);
  };

  const register = async (newUser: User): Promise<string | null> => {
    const result = createUserService(newUser);
    return result;
  };

  const update = async (updatedData: Partial<User>): Promise<string | null> => {
    const result = updateUserService(updatedData);
    if (!result) {
      await mutate();
    }
    return result;
  };

  const deleteAccount = async (): Promise<string | null> => {
    const result = deleteAccountService();
    await mutate(null);
    return result;
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    update,
    deleteAccount,
    refresh: mutate,
  };
}
