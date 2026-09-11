import api from './axios';

export const getNotifications = (params) => api.get('/notifications', { params }).then(res => res.data);
export const markAsRead = (id) => api.put(`/notifications/${id}/read`).then(res => res.data);
export const markAllAsRead = () => api.put('/notifications/read-all').then(res => res.data);
