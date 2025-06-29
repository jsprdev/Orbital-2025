import axios from "axios";

// AXIOS Config
const axiosInstance = axios.create({
  baseURL: `https://${process.env.EXPO_PUBLIC_HOST}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
