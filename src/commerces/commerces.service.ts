import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Commerce } from './entities/commerce.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommerceDto, UpdateCommerceDto } from './dto/commerce.dto';

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
      relations: ['owner'],
    });
  }

  async findAllList() {
    return this.commerceRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: number) {
    const commerce = await this.commerceRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!commerce) {
      throw new NotFoundException('Comercio no encontrado');
    }
    return commerce;
  }

  async update(id: number, updateCommerceDto: UpdateCommerceDto, user: User) {
    const commerce = await this.findOne(id);

    if (commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para editar este comercio',
      );
    }

    Object.assign(commerce, updateCommerceDto);
    return this.commerceRepository.save(commerce);
  }

  async remove(id: number, user: User) {
    const commerce = await this.findOne(id);
    if (commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este comercio',
      );
    }
    return this.commerceRepository.remove(commerce);
  }

  async findProductsByCommerce(id: number) {
    const commerce = await this.findOne(id);
    const products = await this.productRepository.find({
      where: { commerce: { id }, status: ProductStatus.ACTIVE },
      relations: ['category'],
    });
    return { commerce, products };
  }

  async findByAddress(address: string) {
    try {
      // Usar Nominatim (OpenStreetMap) para geocodificar la dirección
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'EcoBocadoApp/1.0',
        },
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servicio de geolocalización');
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new NotFoundException('No se pudo encontrar la dirección proporcionada');
      }

      const { lat, lon } = data[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      return this.findByCoordinates(latitude, longitude);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al procesar la búsqueda por dirección: ' + error.message,
      );
    }
  }

  async findByCoordinates(latitude: number, longitude: number, radiusKm = 3) {
    // Encontrar todos los comercios y calcular la distancia (en km)
    const commerces = await this.commerceRepository.find({
      where: { latitude: Not(IsNull()), longitude: Not(IsNull()) },
      relations: ['products'],
    });

    const commercesWithDistance = commerces.map((commerce) => {
      const now = new Date();
      const activeProducts = (commerce.products ?? []).filter((product) => {
        return (
          product.status === ProductStatus.ACTIVE &&
          Number(product.quantity) > 0 &&
          new Date(product.pickupEnd) >= now
        );
      });

      if (activeProducts.length === 0) {
        return null;
      }
      
      const distance = this.calculateDistance(
        latitude,
        longitude,
        Number(commerce.latitude),
        Number(commerce.longitude),
      );

      // FILTRO 3 KM ACTIVO
      if (distance > radiusKm) {
        return null;
      }

      const pickupLimitDate = activeProducts
        .map((product) => new Date(product.pickupEnd))
        .sort((a, b) => a.getTime() - b.getTime())[0];
      
        return {
          id: commerce.id,
          name: commerce.name,
          description: commerce.description,
          latitude: Number(commerce.latitude),
          longitude: Number(commerce.longitude),
          rating: commerce.rating ? Number(commerce.rating) : null,
          imageUrl: commerce.imageUrl,
          distance: Number(distance.toFixed(1)),
          availableOffers: activeProducts.length,
          pickupLimit: pickupLimitDate
          ? pickupLimitDate.toLocaleTimeString('es-BO', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : null,
      };
    })
    .filter((commerce) => commerce !== null)
    .sort((a, b) => a!.distance - b!.distance);

    // Ordenar por distancia y retornar los más cercanos primero
    return commercesWithDistance;
  }

  // Método privado para calcular distancia usando Haversine (en kilómetros)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
