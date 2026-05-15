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
import { Commerce } from '../commerces/entities/commerce.entity';
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

    const commerce = await this.commercesService.create(
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
      commerce: { id: commerce.id, name: commerce.name },
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

    const result: any = {
      user: {
        id: user.id,
        email: user.email,
        name: fullName,
        role: user.role,
      },
      access_token: await this.jwtService.signAsync(payload),
    };

    if (user.role === UserRole.MERCHANT) {
      const commerceRepo = this.dataSource.getRepository(Commerce);
      const commerce = await commerceRepo.findOne({
        where: { owner: { id: user.id } },
      });
      if (commerce) {
        result.commerce = { id: commerce.id, name: commerce.name };
      }
    }

    return result;
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    const profileRepo = this.dataSource.getRepository(Profile);
    const profile = await profileRepo.findOne({ where: { userId: user.id } });

    const result: any = {
      user: {
        id: user.id,
        email: user.email,
        name: profile?.fullName || null,
        role: user.role,
      },
    };

    if (user.role === UserRole.MERCHANT) {
      const commerceRepo = this.dataSource.getRepository(Commerce);
      const commerce = await commerceRepo.findOne({
        where: { owner: { id: user.id } },
      });
      if (commerce) {
        result.commerce = { id: commerce.id, name: commerce.name };
      }
    }

    return result;
  }

  async logout() {
    return {
      message:
        'Sesión cerrada exitosamente. Asegúrese de eliminar el token en el cliente.',
    };
  }
}
