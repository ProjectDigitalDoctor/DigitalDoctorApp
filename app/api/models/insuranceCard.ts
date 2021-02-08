import InsuranceModel from './insurance';

export default interface InsuranceCardModel {
  id?: number;
  insuranceNumber: string;
  insurance: InsuranceModel;
}
