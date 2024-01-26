import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Checkout } from './entities/checkout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

const PRODUCTS_LIST = [
  {
    id: 1,
    name: 'Product 1',
    description: 'This is a product description',
    image_url: 'https://via.placeholder.com/150',
    price: 100,
    category_id: 1,
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'This is a product description',
    image_url: 'https://via.placeholder.com/150',
    price: 200,
    category_id: 1,
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'This is a product description',
    image_url: 'https://via.placeholder.com/150',
    price: 300,
    category_id: 2,
  },
  {
    id: 4,
    name: 'Product 4',
    description: 'This is a product description',
    image_url: 'https://via.placeholder.com/150',
    price: 400,
    category_id: 2,
  },
  {
    id: 5,
    name: 'Product 5',
    description: 'This is a product description',
    image_url: 'https://via.placeholder.com/150',
    price: 500,
    category_id: 1,
  },
];

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(Checkout) private checkoutRepo: Repository<Checkout>,
    private amqpConnection: AmqpConnection,
  ) {}
  async create(createCheckoutDto: CreateCheckoutDto) {
    const productIds: number[] = createCheckoutDto.items.map((item) => {
      return item.product_id;
    });

    const products = PRODUCTS_LIST.filter((product) => {
      return productIds.includes(product.id);
    });

    const checkout = Checkout.create({
      items: createCheckoutDto.items.map((item) => {
        const product = products.find((product) => {
          return product.id === item.product_id;
        });

        return {
          quantity: item.quantity,
          price: product.price,
          product: {
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            product_id: product.id,
          },
        };
      }),
    });

    await this.checkoutRepo.save(checkout);

    this.amqpConnection.publish('amq.direct', 'checkout.created', {
      checkout_id: checkout.id,
      total: checkout.total,
    });
    return checkout;
  }

  findAll() {
    return this.checkoutRepo.find();
  }

  findOne(id: number) {
    return this.checkoutRepo.findOneByOrFail({ id });
  }

  async pay(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({ id });
    checkout.pay();
    await this.checkoutRepo.save(checkout);
  }

  async fail(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({ id });
    checkout.fail();
    await this.checkoutRepo.save(checkout);
  }
}
