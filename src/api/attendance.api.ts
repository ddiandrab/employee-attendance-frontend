import { apiFetch } from './client';

export interface AttendanceRecord {
  id: number;
  employeeId: number;
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

export function getMyAttendance() {
  return apiFetch<AttendanceRecord[]>(
    '/attendance/me',
  );
}