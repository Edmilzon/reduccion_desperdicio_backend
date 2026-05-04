import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CommercesService } from '../commerces/commerces.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RegisterCommerceDto } from './dto/register-commerce.dto';
import { UserRole, Profile } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly commercesService: CommercesService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      role: role || UserRole.CLIENT,
    });

    if (name) {
      const profileRepo = this.dataSource.getRepository(Profile);
      await profileRepo.save({
        userId: user.id,
        fullName: name,
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const { password: _, ...result } = user;

    return {
      user: { ...result, name },
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerCommerce(registerCommerceDto: RegisterCommerceDto) {
    const {
      email,
      password,
      ownerName,
      commerceName,
      description,
      latitude,
      longitude,
      nit,
    } = registerCommerceDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      role: UserRole.MERCHANT,
    });

    const profileRepo = this.dataSource.getRepository(Profile);
    await profileRepo.save({
      userId: user.id,
      fullName: ownerName,
    });

    await this.commercesService.create(
      {
        name: commerceName,
        description,
        latitude,
        longitude,
        nit,
      },
      user,
    );

    const payload = { sub: user.id, email: user.email, role: user.role };
    const { password: _, ...result } = user;

    return {
      user: { ...result, name: ownerName },
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findWithPasswordByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const profileRepo = this.dataSource.getRepository(Profile);
    const profile = await profileRepo.findOne({ where: { userId: user.id } });
    const fullName = profile?.fullName || null;

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: fullName,
        role: user.role,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    const profileRepo = this.dataSource.getRepository(Profile);
    const profile = await profileRepo.findOne({ where: { userId: user.id } });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: profile?.fullName || null,
        role: user.role,
      }
    };
  }

  async logout() {
    return {
      message:
        'Sesión cerrada exitosamente. Asegúrese de eliminar el token en el cliente.',
    };
  }
}
