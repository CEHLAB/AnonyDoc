import api from './api';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const updateEmail = (currentPassword, newEmail) =>
    api.put('/auth/update-email', { currentPassword, newEmail });
  
  export const updatePassword = (currentPassword, newPassword) =>
    api.put('/auth/update-password', { currentPassword, newPassword });
  
  export const deleteAccount = (currentPassword) =>
    api.delete('/auth/delete-account', { data: { currentPassword } });
  