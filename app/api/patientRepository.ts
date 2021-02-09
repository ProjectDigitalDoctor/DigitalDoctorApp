import {AxiosInstance} from 'axios';
import {getClient} from './client';
import PatientModel from './models/patient';

export default class PatientRepository {
  client: Promise<AxiosInstance>;

  constructor(anonymous?: boolean) {
    this.client = getClient(anonymous);
  }

  async getLoggedInPatient(): Promise<PatientModel> {
    const client = await this.client;
    return client
      .get<PatientModel>('patient')
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting logged in patient: ${error}`);
        throw error;
      });
  }

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
