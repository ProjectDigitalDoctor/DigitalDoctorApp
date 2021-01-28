import DoctorModel from './doctor';
import DrugModel from './drug';

export default interface PrescriptionModel {
  id: number;
  doctor: DoctorModel;
  drug: DrugModel;
  usageDescription: string;
  dateOfIssue: string;
  validUntil: string;
}
