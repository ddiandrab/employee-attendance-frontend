import { apiFetch } from './client';

export interface Employee {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  departmentId: number | null;
  position: string | null;
  joinDate: string | null;
  isActive: boolean;
}

export function getEmployees() {
  return apiFetch<Employee[]>(
    '/employees',
  );
}

export function getEmployee(id: number) {
  return apiFetch<Employee>(
    `/employees/${id}`,
  );
}

export function getMyEmployee() {
  return apiFetch<Employee>(
    '/employees/me',
  );
}

export function createEmployee(
  data: {
    employeeNumber: string;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    departmentId?: number;
    position?: string;
    joinDate?: string;
    userId: number;
  },
) {
  return apiFetch<Employee>(
    '/employees',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export function updateEmployee(
  id: number,
  data: Partial<Employee>,
) {
  return apiFetch<Employee>(
    `/employees/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export function deleteEmployee(
  id: number,
) {
  return apiFetch(
    `/employees/${id}`,
    {
      method: 'DELETE',
    },
  );
}

export function updateMyProfile(
  data: {
    phone?: string;
    photoUrl?: string;
  },
) {
  return apiFetch<Employee>(
    '/employees/me',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}