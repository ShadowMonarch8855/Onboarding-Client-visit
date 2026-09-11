import api from './axios';

export const getContracts = (params) => api.get('/contracts', { params }).then(res => res.data);
export const getContract = (id) => api.get(`/contracts/${id}`).then(res => res.data);
export const createContract = (data) => api.post('/contracts', data).then(res => res.data);
export const sendContract = (id) => api.post(`/contracts/${id}/send`).then(res => res.data);
export const signContract = (id, data) => api.post(`/contracts/${id}/sign`, data).then(res => res.data);
