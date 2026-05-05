import axios from 'axios';

// export const BACKEND_URL = 'https://family-tree-backend-t1qq.onrender.com';
export const BACKEND_URL = 'http://localhost:3005';

export const axiosClient = axios.create({
  baseURL: BACKEND_URL,
});
