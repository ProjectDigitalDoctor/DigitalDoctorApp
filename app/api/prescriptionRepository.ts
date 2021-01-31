import AsyncStorage from '@react-native-async-storage/async-storage';
import {AxiosInstance} from 'axios';
import PrescriptionModel from './models/prescription';

const PrescriptionsCacheKey = 'PRESCRIPTIONS_CACHE';

export default class PrescriptionRepository {
  client: AxiosInstance;
  prescriptionCache?: PrescriptionModel[] = undefined;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async _saveCache(prescriptions: PrescriptionModel[]) {
    this.prescriptionCache = prescriptions;
    try {
      const jsonValue = JSON.stringify(prescriptions);
      await AsyncStorage.setItem(PrescriptionsCacheKey, jsonValue);
    } catch (e) {
      console.error(`failed to cache prescriptions: ${e}`);
    }
  }

  async loadCachedPrescriptions(): Promise<PrescriptionModel[]> {
    if (this.prescriptionCache !== undefined) {
      return Promise.resolve(this.prescriptionCache);
    }
    try {
      const jsonValue = await AsyncStorage.getItem(PrescriptionsCacheKey);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error(`failed to retreive cached prescriptions: ${e}`);
      return [];
    }
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
        this._saveCache(res.data);
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting all prescription: ${error}`);
        throw error;
      });
  }
}
