import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {apiConfig} from './config';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UsernameKey = 'USERNAME';
const PasswordKey = 'PASSWORD';

interface Credentials {
  username: string | null;
  password: string | null;
}

async function getCredentials(): Promise<Credentials> {
  return {
    username: await AsyncStorage.getItem(UsernameKey),
    password: await AsyncStorage.getItem(PasswordKey),
  };
}

async function setCredentials(creds: Credentials): Promise<void> {
  await AsyncStorage.setItem(UsernameKey, creds.username ? creds.username : '');
  await AsyncStorage.setItem(PasswordKey, creds.password ? creds.password : '');
}

export async function getClient(anonymous?: boolean): Promise<AxiosInstance> {
  let creds: Credentials = {username: '', password: ''};

  if (!anonymous) {
    creds = await getCredentials();
    if (!creds.username || !creds.password) {
      throw new Error('Username and/or password not saved.');
    }
  }

  const client = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
      Accept: 'application/json',
    },
    auth: !anonymous
      ? {
          username: creds.username!,
          password: creds.password!,
        }
      : undefined,
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

  return client;
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const client = await getClient();
    await client.get('appointment');
  } catch (error) {
    return false;
  }

  return true;
}

export async function login(creds: Credentials): Promise<boolean> {
  await setCredentials(creds);
  return isLoggedIn();
}

export async function logout(): Promise<void> {
  AsyncStorage.clear();
}
