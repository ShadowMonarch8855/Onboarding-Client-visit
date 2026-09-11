import api from './axios';

export const login = (email, password) => api.post('/auth/login', { email, password }).then(res => res.data);
export const logout = () => api.post('/auth/logout').then(res => res.data);
export const register = (data) => api.post('/auth/register', data).then(res => res.data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email }).then(res => res.data);
export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, { password }).then(res => res.data);
export const getMe = () => api.get('/auth/me').then(res => res.data);
export const getUsers = () => api.get('/auth/users').then(res => res.data);
