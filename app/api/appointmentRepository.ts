import {AxiosInstance} from 'axios';
import AppointmentModel from './models/appointment';
import AppointmentRoomModel from './models/appointmentRoom';

export default class AppointmentRepository {
  client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
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
