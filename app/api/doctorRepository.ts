import {AxiosInstance} from 'axios';
import {getClient} from './client';
import DoctorModel from './models/doctor';

export default class DoctorRepository {
  client: Promise<AxiosInstance> = getClient();

  async getAllDoctors(): Promise<DoctorModel[]> {
    const client = await this.client;
    return client
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
