import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://liveturb.com',
  withCredentials: true, // Permite envio de cookies cross-site
  headers: {
    'X-Requested-With': 'XMLHttpRequest', // Identifica a requisição como AJAX para o Laravel
  },
});

// Opcional: Adicionar interceptors para tratamento de erros global, etc.
// instance.interceptors.response.use(response => response, error => {
//   // Tratamento de erros como 401 Unauthorized, etc.
//   return Promise.reject(error);
// });

export default instance;