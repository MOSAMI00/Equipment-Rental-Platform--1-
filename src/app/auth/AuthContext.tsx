import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

export type UserType = 'tenant' | 'owner';

export interface AuthUser {
  id: string;
  fullName: string;
  phone?: string;
  type: UserType;
}

interface AuthContextValue {
  user: AuthUser | null;
  users: AuthUser[];
  login: (user: AuthUser) => void;
  logout: () => void;
  registerUser: (user: AuthUser) => void;
  findUserByPhone: (phone: string) => AuthUser | undefined;
}

const AUTH_USER_KEY = 'equipment-platform.auth-user';
const AUTH_USERS_KEY = 'equipment-platform.auth-users';

const SEED_USERS: AuthUser[] = [
  { id: 'tenant-1', fullName: 'أحمد محمد', phone: '777123456', type: 'tenant' },
  { id: 'owner-1', fullName: 'أحمد المؤجر', phone: '733123456', type: 'owner' },
];

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStorage<AuthUser | null>(AUTH_USER_KEY, null));
  const [users, setUsers] = useState<AuthUser[]>(() => readStorage<AuthUser[]>(AUTH_USERS_KEY, SEED_USERS));

  useEffect(() => writeStorage(AUTH_USER_KEY, user), [user]);
  useEffect(() => writeStorage(AUTH_USERS_KEY, users), [users]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    users,
    login: (nextUser) => {
      setUsers((existing) => {
        const normalized = normalizePhone(nextUser.phone ?? '');
        const exists = existing.some((item) => item.id === nextUser.id || normalizePhone(item.phone ?? '') === normalized);
        return exists ? existing : [...existing, nextUser];
      });
      setUser(nextUser);
    },
    logout: () => setUser(null),
    registerUser: (nextUser) => {
      setUsers((existing) => {
        const normalized = normalizePhone(nextUser.phone ?? '');
        const withoutDuplicate = existing.filter(
          (item) => item.id !== nextUser.id && normalizePhone(item.phone ?? '') !== normalized,
        );
        return [...withoutDuplicate, nextUser];
      });
      setUser(nextUser);
    },
    findUserByPhone: (phone) => {
      const normalized = normalizePhone(phone);
      return users.find((item) => normalizePhone(item.phone ?? '') === normalized);
    },
  }), [user, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

export function RequireTenant({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.type !== 'tenant') return <Navigate to="/owner" replace />;

  return <>{children}</>;
}

export function RequireOwner({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.type !== 'owner') return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

export function makeMockUser(input: { type: UserType; fullName?: string; phone?: string }): AuthUser {
  const normalizedPhone = normalizePhone(input.phone ?? '');
  return {
    id: input.type === 'owner' ? 'owner-1' : 'tenant-1',
    fullName: input.fullName || (input.type === 'owner' ? 'أحمد المؤجر' : 'أحمد محمد'),
    phone: normalizedPhone,
    type: input.type,
  };
}
