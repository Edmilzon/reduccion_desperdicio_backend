import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CommercesService } from '../commerces/commerces.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly commercesService: CommercesService,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { commerceId, ...productData } = createProductDto;

    // Verificar que el comercio exista y que el usuario sea el dueño
    const commerce = await this.commercesService.findOne(commerceId);
    if (commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para añadir productos a este comercio',
      );
    }

    const product = this.productRepository.create({
      ...productData,
      commerce,
    });

    return this.productRepository.save(product);
  }

  async findAll() {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['commerce'],
    });
  }

  async findByCommerce(commerceId: string, status = 'active') {
    const where: Record<string, unknown> = { commerce: { id: commerceId } };
    if (status === 'active') where.isActive = true;
    if (status === 'expired') where.isActive = false;

    const products = await this.productRepository.find({
      where,
      relations: ['commerce'],
      order: { createdAt: 'DESC' },
    });

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    return products.map((product) => ({
      ...product,
      isNearExpiry: product.expiryDate
        ? product.expiryDate <= twoHoursFromNow && product.expiryDate > now
        : false,
    }));
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['commerce', 'commerce.owner'],
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);

    // Verificar que el usuario sea el dueño del comercio al que pertenece el producto
    if (product.commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para editar este producto',
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, user: User) {
    const product = await this.findOne(id);
    if (product.commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este producto',
      );
    }
    product.isActive = false;
    return this.productRepository.save(product);
  }
}
