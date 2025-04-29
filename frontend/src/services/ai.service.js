import api from './api';

export const anonymizeText = (text) =>
  api.post('/ai/anonymize', { text });   // renvoie { anonymized }
