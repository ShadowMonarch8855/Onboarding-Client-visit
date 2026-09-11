import api from './axios';

export const getInvoices = (params) => api.get('/invoices', { params }).then(res => res.data);
export const getInvoice = (id) => api.get(`/invoices/${id}`).then(res => res.data);
export const createInvoice = (data) => api.post('/invoices', data).then(res => res.data);
export const sendInvoice = (id) => api.post(`/invoices/${id}/send`).then(res => res.data);
