import {AxiosInstance} from 'axios';
import DoctorModel from './models/doctor';

export default class DoctorRepository {
  client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getAllDoctors(): Promise<DoctorModel[]> {
    return this.client
      .get<DoctorModel[]>('doctor/search')
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting all doctors: ${error}`);
        throw error;
      });
  }
}
