import axios from 'axios';

// Create a custom axios instance pointing to your Spring Boot backend
const api = axios.create({
    baseURL: 'http://localhost:8090/api', 
});

// The Interceptor: This runs automatically before EVERY request
api.interceptors.request.use(
    (config) => {
        // Look for the token in the browser's local storage
        const token = localStorage.getItem('token');
        
        // If it exists, attach it to the header exactly like Postman!
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;