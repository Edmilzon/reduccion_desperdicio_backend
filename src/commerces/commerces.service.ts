import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Commerce } from './entities/commerce.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommerceDto, UpdateCommerceDto } from './dto/commerce.dto';
import {
  RestaurantDetailDto,
  OfferDetailDto,
} from './dto/restaurant-detail.dto';

@Injectable()
export class CommercesService {
  constructor(
    @InjectRepository(Commerce)
    private readonly commerceRepository: Repository<Commerce>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createCommerceDto: CreateCommerceDto, user: User) {
    const commerce = this.commerceRepository.create({
      ...createCommerceDto,
      owner: user,
    });
    return this.commerceRepository.save(commerce);
  }

  async findAll() {
    return this.commerceRepository.find({
      where: { isActive: true },
      relations: ['owner'],
    });
  }

  async findOne(id: string) {
    const commerce = await this.commerceRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!commerce) {
      throw new NotFoundException('Comercio no encontrado');
    }
    return commerce;
  }

  async update(id: string, updateCommerceDto: UpdateCommerceDto, user: User) {
    const commerce = await this.findOne(id);

    // Verificar que el usuario sea el dueño
    if (commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para editar este comercio',
      );
    }

    Object.assign(commerce, updateCommerceDto);
    return this.commerceRepository.save(commerce);
  }

  async remove(id: string, user: User) {
    const commerce = await this.findOne(id);
    if (commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este comercio',
      );
    }
    commerce.isActive = false;
    return this.commerceRepository.save(commerce);
  }

  async findDetail(id: string): Promise<RestaurantDetailDto> {
    const commerce = await this.commerceRepository.findOne({
      where: { id, isActive: true },
    });
    if (!commerce) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    const now = new Date();
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const products = await this.productRepository.find({
      where: {
        commerce: { id },
        isActive: true,
        pickupDeadline: Between(now, todayEnd),
      },
    });

    const offers: OfferDetailDto[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      originalPrice: Number(p.originalPrice),
      price: Number(p.price),
      quantity: p.quantity,
      pickupDeadline: p.pickupDeadline,
      expiryDate: p.expiryDate,
    }));

    return {
      id: commerce.id,
      name: commerce.name,
      description: commerce.description,
      address: commerce.address,
      phone: commerce.phone,
      isActive: commerce.isActive,
      offers,
    };
  }
}
