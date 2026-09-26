import api from './api';

export interface User {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
  role: {
    id: string;
    name: string;
  };
}

export async function getUsers(params: any = {}) {
  const res = await api.get('/api/v1/users', { params });
  return res.data.data;
}

export async function updateUserStatus(id: string, status: string) {
  const res = await api.patch(`/api/v1/users/${id}/status`, { status });
  return res.data.data.user;
}
