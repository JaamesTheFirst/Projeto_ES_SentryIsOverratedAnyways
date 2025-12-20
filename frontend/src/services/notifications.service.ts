import { api } from './api';
import { Notification } from '../types';

export const notificationsService = {
  getAll: async (unreadOnly?: boolean): Promise<Notification[]> => {
    const params = unreadOnly ? '?unreadOnly=true' : '';
    const response = await api.get<Notification[]>(`/notifications${params}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};

