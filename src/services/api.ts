import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.0.50:3000/api',
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