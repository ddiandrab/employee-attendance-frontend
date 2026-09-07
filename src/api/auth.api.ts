import { apiFetch } from './client';

export interface LoginResponse {
  accessToken: string;
}

export interface CurrentUser {
  userId: number;
  email: string;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
}

export function login(
  email: string,
  password: string,
) {
  return apiFetch<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

export function getMe() {
  return apiFetch<CurrentUser>(
    '/auth/me',
  );
}