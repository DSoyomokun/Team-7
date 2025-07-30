// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.88:3000/api', // Use your actual IP address here
  timeout: 5000,
});
