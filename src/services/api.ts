import axios from 'axios';

export const api_URL = '192.168.0.19'

const api = axios.create({
    baseURL: `http://${api_URL}:3000/api`,
    headers: {
        'Content-Type': undefined // Esto permite que Axios lo detecte automáticamente
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;