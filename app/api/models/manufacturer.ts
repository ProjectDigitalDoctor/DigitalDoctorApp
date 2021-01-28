import AddressModel from './address';

export default interface ManufacturerModel {
  id: number;
  name: string;
  address: AddressModel;
};
