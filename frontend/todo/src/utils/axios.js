import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post('http://127.0.0.1:8000/api/token/refresh/', {}, {
          withCredentials: true,
        });
        return api(originalRequest);
      } catch (refreshError) {
        const navigate = useNavigate();
        navigate('/')
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
