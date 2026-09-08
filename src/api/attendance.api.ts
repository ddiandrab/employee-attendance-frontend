import { apiFetch } from './client';

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
}

export interface AllAttendanceRecord {
  id: number;
  employeeId: number;
  employeeNumber: string;
  employeeName: string;
  departmentId: number | null;
  position: string | null;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
}

export function checkIn() {
  return apiFetch<AttendanceRecord>(
    '/attendance/check-in',
    {
      method: 'POST',
    },
  );
}

export function checkOut() {
  return apiFetch<AttendanceRecord>(
    '/attendance/check-out',
    {
      method: 'POST',
    },
  );
}

export function getMyAttendance(
  from?: string,
  to?: string,
) {
  const params = new URLSearchParams();

  if (from) {
    params.set('from', from);
  }

  if (to) {
    params.set('to', to);
  }

  const query =
    params.toString();

  return apiFetch<AttendanceRecord[]>(
    `/attendance/me${query ? `?${query}` : ''}`,
  );
}

export function getAllAttendance(
  from?: string,
  to?: string,
) {
  const params =
    new URLSearchParams();

  if (from) {
    params.set('from', from);
  }

  if (to) {
    params.set('to', to);
  }

  const query =
    params.toString();

  return apiFetch<AllAttendanceRecord[]>(
    `/attendance${query ? `?${query}` : ''}`,
  );
}