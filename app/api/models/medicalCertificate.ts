import DoctorModel from './doctor';

export default interface MedicalCertificateModel {
  id: number;
  doctor: DoctorModel;
  reason: string;
  dateOfIssue: string;
  validUntil: string;
};
