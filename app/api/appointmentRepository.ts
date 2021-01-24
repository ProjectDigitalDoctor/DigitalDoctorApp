import {AxiosInstance} from 'axios';
import Appointment from './models/appointment';
import AppointmentRoom from './models/appointmentRoom';

export default class AppointmentRepository {
  client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getAppointment(id: number): Promise<Appointment> {
    return this.client
      .get<Appointment>(`appointment/${id}`)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting appointment: ${error}`);
        throw error;
      });
  }

  async joinAppointment(id: number): Promise<AppointmentRoom> {
    return this.client
      .post<AppointmentRoom>(`appointment/${id}/join`)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed to join appointment: ${error}`);
        throw error;
      });
  }
}
