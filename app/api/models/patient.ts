import AddressModel from './address';
import InsuranceCardModel from './insuranceCard';
import WorkplaceModel from './workplace';

export default interface PatientModel {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  address: AddressModel;
  workplace: WorkplaceModel;
  insuranceCard: InsuranceCardModel;
}
