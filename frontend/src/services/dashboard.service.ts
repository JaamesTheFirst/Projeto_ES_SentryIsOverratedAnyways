import { api } from './api';
import { DashboardStats, ErrorGroup } from '../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getRecentErrors: async (): Promise<ErrorGroup[]> => {
    const response = await api.get<ErrorGroup[]>('/dashboard/recent-errors');
    return response.data;
  },
};

