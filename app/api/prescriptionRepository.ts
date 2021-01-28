import {AxiosInstance} from 'axios';
import PrescriptionModel from './models/prescription';

export default class PrescriptionRepository {
  client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getPrescription(id: number): Promise<PrescriptionModel> {
    return this.client
      .get<PrescriptionModel>(`prescription/${id}`)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting prescription: ${error}`);
        throw error;
      });
  }

  async getAllPrescriptions(): Promise<PrescriptionModel[]> {
    return this.client
      .get<PrescriptionModel[]>('prescription')
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting all prescription: ${error}`);
        throw error;
      });
  }
}
