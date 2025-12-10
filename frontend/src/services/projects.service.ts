import { api } from './api';
import { Project } from '../types';

export const projectsService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    icon?: string;
    status?: 'active' | 'archived' | 'maintenance';
  }): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  getStats: async (id: string): Promise<{
    totalErrors: number;
    unresolved: number;
    resolved: number;
    lastError: string | null;
  }> => {
    const response = await api.get(`/projects/${id}/stats`);
    return response.data;
  },
};

