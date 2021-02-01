import AddressModel from './address';

export default interface ShopModel {
  id: number;
  name: string;
  address: AddressModel;
  mailAddress: string;
}
