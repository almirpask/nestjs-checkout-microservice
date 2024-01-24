import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export type CreateCheckoutCommand = {
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      description: string;
      image_url: string;
      product_id: number;
    };
  }[];
};

export enum CheckoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  status: CheckoutStatus = CheckoutStatus.PENDING;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => CheckoutItem, (item) => item.checkout, {
    cascade: ['insert'],
  })
  items: CheckoutItem[];
  static create(input: CreateCheckoutCommand) {
    const checkout = new Checkout();
    checkout.items = input.items.map((item) => {
      const checkoutItem = new CheckoutItem();
      checkoutItem.price = item.price;
      checkoutItem.quantity = item.quantity;
      checkoutItem.product = new CheckoutProduct();
      checkoutItem.product.name = item.product.name;
      checkoutItem.product.description = item.product.description;
      checkoutItem.product.image_url = item.product.image_url;
      checkoutItem.product.product_id = item.product.product_id;
      return checkoutItem;
    });

    checkout.total = checkout.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    return checkout;
  }
}

@Entity()
export class CheckoutProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column()
  product_id: number;
}

@Entity()
export class CheckoutItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Checkout)
  checkout: Checkout;

  @ManyToOne(() => CheckoutProduct, {
    cascade: ['insert'],
    eager: true,
  })
  product: CheckoutProduct;
}
