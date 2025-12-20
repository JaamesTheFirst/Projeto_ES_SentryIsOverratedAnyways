import { api } from './api';
import { ErrorGroup, ErrorListResponse, ErrorComment, ErrorSeverity, ErrorStatus } from '../types';

export interface ErrorFilters {
  projectId?: string;
  severity?: ErrorSeverity;
  status?: ErrorStatus;
  search?: string;
  dateRange?: '24h' | '7d' | '30d' | 'all';
  page?: number;
  limit?: number;
}

export const errorsService = {
  getAll: async (filters?: ErrorFilters): Promise<ErrorListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<ErrorListResponse>(`/errors?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<ErrorGroup> => {
    const response = await api.get<ErrorGroup>(`/errors/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    projectId: string;
    stackTrace: string;
    severity: ErrorSeverity;
    file?: string;
    line?: string;
    url?: string;
    userAgent?: string;
    environment?: string;
  }): Promise<ErrorGroup> => {
    const response = await api.post<ErrorGroup>('/errors', data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      status?: ErrorStatus;
      assignedToId?: string;
    }
  ): Promise<ErrorGroup> => {
    const response = await api.patch<ErrorGroup>(`/errors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/errors/${id}`);
  },

  // Comment methods
  getComments: async (errorId: string): Promise<ErrorComment[]> => {
    const response = await api.get<ErrorComment[]>(`/errors/${errorId}/comments`);
    return response.data;
  },

  addComment: async (errorId: string, content: string, isInternal?: boolean): Promise<ErrorComment> => {
    const response = await api.post<ErrorComment>(`/errors/${errorId}/comments`, {
      content,
      isInternal: isInternal || false,
    });
    return response.data;
  },
};

