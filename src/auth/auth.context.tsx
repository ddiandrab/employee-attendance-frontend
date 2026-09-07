import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getMe,
  login as loginApi,
  type CurrentUser,
} from '../api/auth.api';

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem('accessToken');

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(
          'accessToken',
        );
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(
    email: string,
    password: string,
  ) {
    const result =
      await loginApi(email, password);

    localStorage.setItem(
      'accessToken',
      result.accessToken,
    );

    const currentUser =
      await getMe();

    setUser(currentUser);
  }

  function logout() {
    localStorage.removeItem(
      'accessToken',
    );

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}