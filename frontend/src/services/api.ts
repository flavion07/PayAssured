import apiClient from '@/utils/api';
import {
  Client,
  Case,
  CreateCasePayload,
  UpdateCasePayload,
  CreateClientPayload,
  UpdateClientPayload,
} from '@/types';

// Client API calls
export const clientsAPI = {
  list: async (skip = 0, limit = 10) => {
    const response = await apiClient.get<Client[]>('/api/clients', {
      params: { skip, limit },
    });
    return response.data;
  },

  get: async (id: number) => {
    const response = await apiClient.get<Client>(`/api/clients/${id}`);
    return response.data;
  },

  create: async (payload: CreateClientPayload) => {
    const response = await apiClient.post<Client>('/api/clients', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateClientPayload) => {
    const response = await apiClient.put<Client>(`/api/clients/${id}`, payload);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/clients/${id}`);
  },
};

// Case API calls
export const casesAPI = {
  list: async (
    skip = 0,
    limit = 10,
    status?: string,
    sortBy = 'created_at',
    order = 'desc'
  ) => {
    const params: any = { skip, limit, sort_by: sortBy, order };
    if (status) {
      params.status = status;
    }
    const response = await apiClient.get<Case[]>('/api/cases', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await apiClient.get<Case>(`/api/cases/${id}`);
    return response.data;
  },

  create: async (payload: CreateCasePayload) => {
    const response = await apiClient.post<Case>('/api/cases', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateCasePayload) => {
    const response = await apiClient.put<Case>(`/api/cases/${id}`, payload);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/cases/${id}`);
  },
};
