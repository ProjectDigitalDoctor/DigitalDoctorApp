import {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppointmentModel from './models/appointment';
import AppointmentRoomModel from './models/appointmentRoom';
import {getClient} from './client';

const AppointmentsCacheKey = 'APPOINTMENTS_CACHE';

export interface RequestAppointment {
  patientID: number;
  doctorID: number;
  reason: string;
  timestamp: string;
  duration: number;
}

export default class AppointmentRepository {
  client: Promise<AxiosInstance> = getClient();
  appointmentsCache?: AppointmentModel[] = undefined;

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
    const client = await this.client;
    return client
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
    const client = await this.client;
    return client
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
    const client = await this.client;
    return client
      .post<AppointmentRoomModel>(`appointment/${id}/join`)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed to join appointment: ${error}`);
        throw error;
      });
  }

  async deleteAppointment(id: number): Promise<void> {
    const client = await this.client;
    return client
      .delete(`appointment/${id}`)
      .then((res) => {
        return;
      })
      .catch((error) => {
        console.log(`failed to delete appointment: ${error}`);
        throw error;
      });
  }

  async createAppointment(reqAppointment: RequestAppointment): Promise<void> {
    const client = await this.client;
    return client
      .post('appointment', reqAppointment)
      .then((res) => {
        return;
      })
      .catch((error) => {
        console.log(`failed to create appointment: ${error}`);
        throw error;
      });
  }
}
