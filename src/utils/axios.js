import axios from 'axios';
import { END_POINT_SEVER_BILL_ORDER } from '../constants/api';
import { USER_KEY } from '../constants';

// Create a configured Axios instance
const axiosInstance = axios.create({
  baseURL: END_POINT_SEVER_BILL_ORDER, // Your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    // Add any default headers here
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., add auth token)
    const user = localStorage.getItem(USER_KEY);
    // const user = profile;
    const token = JSON.parse(user)?.["accessToken"];

    if (token) {
      config.headers.Authorization = `AppZap ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response here before it's passed to then()
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirect to login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;