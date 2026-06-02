import React, { createContext, useContext, useCallback } from 'react';
import { User, Role } from '../types';
import { usePersistentState } from '../utils/usePersistentState';
import { useSupabaseTable } from '../lib/useSupabaseTable';

interface RegisterResult { success: boolean; error?: string; userId?: number }

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (email: string, password: string, role: Role, extra?: Partial<User>) => RegisterResult;
  logout: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  hasAdmin: boolean;
  createSuperAdmin: (email: string, password: string, fullName: string) => RegisterResult;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers, loading] = useSupabaseTable<User>('users');
  const [user, setUser] = usePersistentState<User | null>('if_session', null);

  const hasAdmin = users.some(u => u.role === 'admin');

  const nextId = () => Math.max(0, ...users.map(u => u.id)) + 1;

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, [users, setUser]);

  const register = useCallback((email: string, password: string, role: Role, extra?: Partial<User>) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser: User = {
      id: nextId(),
      email,
      password,
      role,
      full_name: extra?.full_name ?? null,
      is_super: extra?.is_super ?? false,
      created_at: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, userId: newUser.id };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, setUsers]);

  // Creates the very first admin as SUPERADMIN and logs them in.
  const createSuperAdmin = useCallback((email: string, password: string, fullName: string) => {
    if (users.some(u => u.role === 'admin')) {
      return { success: false, error: 'An administrator already exists.' };
    }
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser: User = {
      id: nextId(),
      email,
      password,
      role: 'admin',
      full_name: fullName,
      is_super: true,
      created_at: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true, userId: newUser.id };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, setUsers, setUser]);

  const logout = useCallback(() => setUser(null), [setUser]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, users, setUsers, hasAdmin, createSuperAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
