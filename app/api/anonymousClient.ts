import axios, {AxiosRequestConfig} from 'axios';
import {apiConfig} from './config';

const client = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    Accept: 'application/json',
  },
  timeout: 200,
});

// Intercept all requests
client.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    console.log(`anonymous req: ${config?.method?.toUpperCase()} - ${config?.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercept all responses
client.interceptors.response.use(
  async (response) => {
    console.log(`anonymous resp: ${response?.status} - ${response?.config?.url}:`);
    return response;
  },
  (error) => {
    console.log(`anonymous err: ${error?.response?.status} - ${error?.response?.config?.url}:`);
    return Promise.reject(error);
  },
);

export default client;
