import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1/', 
    withCredentials: true 
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('jwt')
    console.log("the tokrn is: ", token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
