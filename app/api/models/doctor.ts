import AddressModel from './address';

export default interface DoctorModel {
  id: number;
  firstName: string;
  lastName: string;
  address: AddressModel;
  profession: string;
}
