import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Commerce } from './entities/commerce.entity';
import { Location } from './entities/location.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
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
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
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

  async findByAddress(address: string, radiusKm = 3) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'EcoBocadoApp/1.0',
        },
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servicio de geolocalización');
      }

      const data: { lat: string; lon: string }[] = await response.json();

      if (!data || data.length === 0) {
        throw new NotFoundException(
          'No se pudo encontrar la dirección proporcionada',
        );
      }

      const { lat, lon } = data[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      return this.findByCoordinates(latitude, longitude, radiusKm);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al procesar la búsqueda por dirección: ' +
          (error as Error).message,
      );
    }
  }

  async findByCoordinates(latitude: number, longitude: number, radiusKm = 0) {
    try {
      const unlimited = radiusKm <= 0;
      console.log(
        `[findByCoordinates] lat: ${latitude}, lng: ${longitude}, radius: ${unlimited ? 'sin límite' : radiusKm}`,
      );

      const locations = await this.locationRepository.find({
        where: { latitude: Not(IsNull()), longitude: Not(IsNull()) },
        relations: ['commerce', 'products'],
      });

      const now = new Date();
      const locationsWithDistance = locations
        .map((location) => {
          try {
            if (!location.commerce) {
              console.warn(
                `[findByCoordinates] Location ${location.id} has no commerce associated.`,
              );
              return null;
            }

            const activeProducts = (location.products ?? []).filter(
              (product) => {
                return (
                  product.status === ProductStatus.ACTIVE &&
                  Number(product.quantity) > 0 &&
                  product.pickupEnd &&
                  new Date(product.pickupEnd) >= now
                );
              },
            );

            const locLat = Number(location.latitude);
            const locLng = Number(location.longitude);

            if (isNaN(locLat) || isNaN(locLng)) {
              return null;
            }

            const distance = this.calculateDistance(
              latitude,
              longitude,
              locLat,
              locLng,
            );

            if (!unlimited && distance > radiusKm) {
              return null;
            }

            let pickupLimitDate = null;
            if (activeProducts.length > 0) {
              try {
                pickupLimitDate = activeProducts
                  .map((product) => new Date(product.pickupEnd))
                  .filter((date) => !isNaN(date.getTime()))
                  .sort((a, b) => a.getTime() - b.getTime())[0];
              } catch (e) {
                console.error(
                  `[findByCoordinates] Error calculating pickupLimit for location ${location.id}`,
                  e,
                );
              }
            }

            return {
              id: location.id,
              restaurantId: location.commerce.id,
              name: location.commerce.name,
              branchName: location.name,
              description:
                location.description || location.commerce.description,
              latitude: locLat,
              longitude: locLng,
              rating: location.commerce.rating
                ? Number(location.commerce.rating)
                : null,
              imageUrl: location.commerce.imageUrl,
              distance: Number(distance.toFixed(1)),
              availableOffers: activeProducts.length,
              hasActiveOffers: activeProducts.length > 0,
              pickupLimit: pickupLimitDate
                ? pickupLimitDate.toLocaleTimeString('es-BO', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : null,
            };
          } catch (innerError) {
            console.error(
              `[findByCoordinates] Error processing location ${location.id}:`,
              innerError,
            );
            return null;
          }
        })
        .filter((loc) => loc !== null)
        .sort((a, b) => a.distance - b.distance);

      return locationsWithDistance;
    } catch (error) {
      console.error('[findByCoordinates] Error general:', error);
      throw new BadRequestException(
        'Error al buscar locales cercanos: ' + error.message,
      );
    }
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

  async findDetail(id: number): Promise<RestaurantDetailDto> {
    const commerce = await this.commerceRepository.findOne({
      where: { id },
    });
    if (!commerce) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    const location = await this.locationRepository.findOne({
      where: { restaurantId: id },
    });

    const products = await this.productRepository.find({
      where: {
        commerce: { id },
        status: ProductStatus.ACTIVE,
      },
      relations: ['category'],
    });

    const offers: OfferDetailDto[] = products.map((p) => ({
      id: String(p.id),
      name: p.title,
      description: p.description,
      originalPrice: Number(p.originalPrice),
      price: Number(p.price),
      quantity: p.quantity,
      pickupDeadline: p.pickupEnd,
      expiryDate: null,
    }));

    return {
      id: String(commerce.id),
      name: commerce.name,
      description: commerce.description,
      address: location?.name ?? '',
      phone: location?.phone ?? null,
      isActive: true,
      offers,
    };
  }
}
