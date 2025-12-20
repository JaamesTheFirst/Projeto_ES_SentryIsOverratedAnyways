import { api } from './api';
import { User, ErrorGroup, ErrorListResponse } from '../types';
import { ErrorFilters } from './errors.service';

export const adminService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/auth/all');
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<User> => {
    const response = await api.patch<User>(`/auth/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/auth/${userId}`);
  },

  // Admin error management
  getAllErrors: async (filters?: ErrorFilters): Promise<ErrorListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<ErrorListResponse>(`/errors/admin/all?${params.toString()}`);
    return response.data;
  },
};

