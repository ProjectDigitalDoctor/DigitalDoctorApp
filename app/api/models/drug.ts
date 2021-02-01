import ManufacturerModel from './manufacturer';
import OfferModel from './offer';

export default interface DrugModel {
  pzn: string;
  name: string;
  manufacturer: ManufacturerModel;
  sideEffects: string;
  usage: string;
  offers: OfferModel[];
};
