import AsyncStorage from '@react-native-async-storage/async-storage';
import {AxiosInstance} from 'axios';
import {getClient} from './client';
import MedicalCertificationModel from './models/medicalCertificate';

const MedicalCertificatesCacheKey = 'MEDICAL_CERTIFICATES_CACHE';

export default class MedicalCertificateRepository {
  client: Promise<AxiosInstance> = getClient();
  certificatesCache?: MedicalCertificationModel[] = undefined;

  async _saveCache(certificates: MedicalCertificationModel[]) {
    this.certificatesCache = certificates;
    try {
      const jsonValue = JSON.stringify(certificates);
      await AsyncStorage.setItem(MedicalCertificatesCacheKey, jsonValue);
    } catch (e) {
      console.error(`failed to cache medical certificates: ${e}`);
    }
  }

  async loadCachedMedicalCertificates(): Promise<MedicalCertificationModel[]> {
    if (this.certificatesCache !== undefined) {
      return Promise.resolve(this.certificatesCache);
    }
    try {
      const jsonValue = await AsyncStorage.getItem(MedicalCertificatesCacheKey);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error(`failed to retreive cached medical certificates: ${e}`);
      return [];
    }
  }

  async getMedicalCertificate(id: number): Promise<MedicalCertificationModel> {
    const client = await this.client;
    return client
      .get<MedicalCertificationModel>(`medical-certificate/${id}`)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting medical certificate: ${error}`);
        throw error;
      });
  }

  async getAllMedicalCertificates(): Promise<MedicalCertificationModel[]> {
    const client = await this.client;
    return client
      .get<MedicalCertificationModel[]>('medical-certificate')
      .then(async (res) => {
        this._saveCache(res.data);
        return res.data;
      })
      .catch((error) => {
        console.log(`failed getting all medical certificates: ${error}`);
        throw error;
      });
  }
}
