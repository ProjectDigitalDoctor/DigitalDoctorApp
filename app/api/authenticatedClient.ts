import axios, {AxiosRequestConfig} from 'axios';
import {apiConfig} from './config';
import CookieManager from '@react-native-cookies/cookies';

const client = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    Accept: 'application/json',
  },
  auth: {
    username: apiConfig.username,
    password: apiConfig.password,
  },
  timeout: 2000,
});

// Intercept all requests
client.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    console.log(`authenticated req: ${config?.method?.toUpperCase()} - ${config?.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercept all responses
client.interceptors.response.use(
  async (response) => {
    console.log(`authenticated resp: ${response?.status} - ${response?.config?.url}`);
    CookieManager.clearAll();
    return response;
  },
  (error) => {
    console.log(`authenticated err: ${error?.response?.status} - ${error?.response?.config?.url}`);
    return Promise.reject(error);
  },
);

export default client;
