import axios from 'axios';

// AXIOS Config
const axiosInstance = axios.create({
  baseURL: `http://${process.env.EXPO_PUBLIC_HOST}:${process.env.EXPO_PUBLIC_PORT}`,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;