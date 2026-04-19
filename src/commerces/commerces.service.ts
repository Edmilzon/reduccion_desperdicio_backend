import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commerce } from './entities/commerce.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommerceDto, UpdateCommerceDto } from './dto/commerce.dto';

@Injectable()
export class CommercesService {
  constructor(
    @InjectRepository(Commerce)
    private readonly commerceRepository: Repository<Commerce>,
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
      throw new ForbiddenException('No tienes permiso para editar este comercio');
    }

    Object.assign(commerce, updateCommerceDto);
    return this.commerceRepository.save(commerce);
  }

  async remove(id: string, user: User) {
    const commerce = await this.findOne(id);
    if (commerce.owner.id !== user.id) {
      throw new ForbiddenException('No tienes permiso para eliminar este comercio');
    }
    commerce.isActive = false;
    return this.commerceRepository.save(commerce);
  }
}
