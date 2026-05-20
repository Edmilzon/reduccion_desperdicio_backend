export class OfferDetailDto {
  id: string;
  name: string;
  description: string | null;
  originalPrice: number;
  price: number;
  quantity: number;
  pickupDeadline: Date | null;
  expiryDate: Date | null;
}

export class RestaurantDetailDto {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  isActive: boolean;
  offers: OfferDetailDto[];
}
