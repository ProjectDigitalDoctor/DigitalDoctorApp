import {AxiosInstance} from 'axios';
import {getClient} from './client';
import PatientModel from './models/patient';

export default class PatientRepository {
  client: Promise<AxiosInstance> = getClient(true);

  async registerPatient(newPatient: PatientModel): Promise<PatientModel> {
    const client = await this.client;
    return client
      .post<PatientModel>('patient', newPatient)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed registering new patient: ${error}`);
        throw error;
      });
  }
}
