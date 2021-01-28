import ManufacturerModel from './manufacturer';

export default interface DrugModel {
  pzn: string;
  name: string;
  manufacturer: ManufacturerModel;
  sideEffects: string;
  usage: string;
}
