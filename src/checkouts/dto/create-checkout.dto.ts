export class CheckoutItemDto {
  quantity: number;
  product_id: number;
}

export class CreateCheckoutDto {
  items: CheckoutItemDto[];
}
