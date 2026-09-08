import { apiFetch } from './client';

export interface Notification {
  id: number;
  recipientId: number;
  type:
    | 'EMPLOYEE_PROFILE_UPDATED';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getNotifications() {
  return apiFetch<Notification[]>(
    '/notifications',
  );
}

export function markNotificationAsRead(
  id: number,
) {
  return apiFetch(
    `/notifications/${id}/read`,
    {
      method: 'PATCH',
    },
  );
}

export function markAllNotificationsAsRead() {
  return apiFetch(
    '/notifications/read-all',
    {
      method: 'PATCH',
    },
  );
}