import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CommercesService } from '../commerces/commerces.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RegisterCommerceDto } from './dto/register-commerce.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly commercesService: CommercesService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      role: role || undefined,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    const { password: _, ...result } = user;
    
    return {
      user: result,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerCommerce(registerCommerceDto: RegisterCommerceDto) {
    const { email, password, ownerName, commerceName, address, phone, description } = registerCommerceDto;

    // 1. Crear el usuario con rol OWNER
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name: ownerName,
      role: UserRole.OWNER,
    });

    // 2. Crear el comercio asociado
    await this.commercesService.create({
      name: commerceName,
      address,
      phone,
      description,
    }, user);

    // 3. Generar token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const { password: _, ...result } = user;

    return {
      user: result,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
