import api from './axios';

export const getAssets = (params) => api.get('/assets', { params }).then(res => res.data);
export const uploadAsset = (formData) => api.post('/assets/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => res.data);
export const downloadAsset = (id) => api.get(`/assets/${id}/download`, { responseType: 'blob' }).then(res => res.data);
export const deleteAsset = (id) => api.delete(`/assets/${id}`).then(res => res.data);
