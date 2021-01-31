import {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppointmentModel from './models/appointment';
import AppointmentRoomModel from './models/appointmentRoom';

const AppointmentsCacheKey = 'APPOINTMENTS_CACHE';

export default class AppointmentRepository {
  client: AxiosInstance;
  appointmentsCache?: AppointmentModel[] = undefined;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async _saveCache(appointments: AppointmentModel[]) {
    this.appointmentsCache = appointments;
    try {
      const jsonValue = JSON.stringify(appointments);
      await AsyncStorage.setItem(AppointmentsCacheKey, jsonValue);
    } catch (e) {
      console.error(`failed to cache appointments: ${e}`);
    }
  }

  async loadCachedAppointments(): Promise<AppointmentModel[]> {
    if (this.appointmentsCache !== undefined) {
      return Promise.resolve(this.appointmentsCache);
    }
    try {
      const jsonValue = await AsyncStorage.getItem(AppointmentsCacheKey);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error(`failed to retreive cached appointments: ${e}`);
      return [];
    }
  }

  async getAppointment(id: number): Promise<AppointmentModel> {
    return this.client
      .get<AppointmentModel>(`appointment/${id}`)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting appointment: ${error}`);
        throw error;
      });
  }

  async getAllAppointments(): Promise<AppointmentModel[]> {
    return this.client
      .get<AppointmentModel[]>('appointment')
      .then(async (res) => {
        this._saveCache(res.data);
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting all appointments: ${error}`);
        throw error;
      });
  }

  async joinAppointment(id: number): Promise<AppointmentRoomModel> {
    return this.client
      .post<AppointmentRoomModel>(`appointment/${id}/join`)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed to join appointment: ${error}`);
        throw error;
      });
  }
}
