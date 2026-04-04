import api from './api';

export async function fetchRecords(filters = {}){
  const params = {};
  if(filters.type) params.type = filters.type;
  if(filters.category) params.category = filters.category;
  if(filters.startDate) params.startDate = filters.startDate;
  if(filters.endDate) params.endDate = filters.endDate;
  const res = await api.get('/api/records', { params });
  return res.data.records || res.data;
}

export async function createRecord(payload){
  const res = await api.post('/api/records', payload);
  return res.data.record || res.data;
}

export async function updateRecord(id,payload){
  const res = await api.put(`/api/records/${id}`, payload);
  return res.data.record || res.data;
}

export async function deleteRecord(id){
  const res = await api.delete(`/api/records/${id}`);
  return res.data;
}
