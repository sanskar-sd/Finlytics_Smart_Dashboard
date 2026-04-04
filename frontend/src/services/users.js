import api from './api';

export async function fetchUsers(){
  const res = await api.get('/api/users');
  return res.data.users || res.data;
}

export async function createUser(payload){
  const res = await api.post('/api/users', payload);
  return res.data.user || res.data;
}

export async function changeUserRole(userId, role){
  const res = await api.patch('/api/users/role', { userId, role });
  return res.data.user || res.data;
}

export async function changeUserStatus(userId, status){
  const res = await api.patch('/api/users/status', { userId, status });
  return res.data.user || res.data;
}
