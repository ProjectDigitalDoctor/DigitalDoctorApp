import ShopModel from './shop';

export default interface OfferModel {
  id: number;
  shop: ShopModel;
  price: number;
}
