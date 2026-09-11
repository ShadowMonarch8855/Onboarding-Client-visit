import api from './axios';

export const getInstance = (id) => api.get(`/onboarding/${id}`).then(res => res.data);
export const getProgress = (id) => api.get(`/onboarding/${id}/progress`).then(res => res.data);
export const updateStep = (instanceId, stepId, data) => api.put(`/onboarding/${instanceId}/steps/${stepId}`, data).then(res => res.data);
export const submitOnboarding = (id) => api.post(`/onboarding/${id}/submit`).then(res => res.data);
export const reviewOnboarding = (id, data) => api.post(`/onboarding/${id}/review`, data).then(res => res.data);
export const getTemplates = () => api.get('/onboarding/templates').then(res => res.data);
