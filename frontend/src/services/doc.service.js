import api from './api';

export const uploadDoc = (file) => {
  const data = new FormData();
  data.append('file', file);
  return api.post('/doc/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getDoc = (id)       => api.get(`/doc/${id}`);
export const deleteFile = (id)   => api.delete(`/doc/file/${id}`);
export const deleteDoc  = (id)   => api.delete(`/doc/${id}`);


export const downloadUrl = (id) =>
  `${import.meta.env.VITE_API_URL}/doc/download/anony/${id}`;

export const downloadOriginalUrl = (id) =>
  `${import.meta.env.VITE_API_URL}/doc/download/original/${id}`;


  