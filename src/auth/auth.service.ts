import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { CommercesService } from '../commerces/commerces.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RegisterCommerceDto } from './dto/register-commerce.dto';
import { UserRole, Profile, User } from '../users/entities/user.entity';
import { Commerce } from '../commerces/entities/commerce.entity';
import { PasswordHistory } from '../users/entities/password-history.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DataSource } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly commercesService: CommercesService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly mailerService: MailerService,
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

      user.resetToken = hash;
      user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
      user.resetPasswordAttempts = 0;

      await userRepo.save(user);

      // Enviar correo (Fire and forget, no usamos await para no bloquear la respuesta)
      this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Recuperación de contraseña - Eco Bocado',
          template: './forgot-password',
          context: { token: resetToken },
        })
        .catch(console.error);
    }

    // Respuesta Anti-Enumeración
    return {
      message:
        'Si el correo está registrado, se han enviado las instrucciones para recuperar tu contraseña.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, token, newPassword } = resetPasswordDto;
    const userRepo = this.dataSource.getRepository(User);
    const historyRepo = this.dataSource.getRepository(PasswordHistory);

    const user = await userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.passwordHistory', 'passwordHistory')
      .where('user.email = :email', { email })
      .getOne();

    if (!user || !user.resetToken || !user.resetPasswordExpires) {
      throw new BadRequestException('Token inválido o expirado.');
    }

    if (new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Token inválido o expirado.');
    }

    const hashedIncomingToken = crypto.createHash('sha256').update(token).digest('hex');

    if (user.resetToken !== hashedIncomingToken) {
      user.resetPasswordAttempts += 1;
      if (user.resetPasswordAttempts >= 3) {
        user.resetToken = null as any;
        user.resetPasswordExpires = null as any;
        user.resetPasswordAttempts = 0;
      }
      await userRepo.save(user);
      throw new BadRequestException('Token inválido o expirado.');
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      throw new BadRequestException('La nueva contraseña no puede ser igual a la actual.');
    }

    if (user.passwordHistory && user.passwordHistory.length > 0) {
      for (const history of user.passwordHistory) {
        const isMatch = await bcrypt.compare(newPassword, history.passwordHash);
        if (isMatch) {
          throw new BadRequestException(
            'No puedes repetir una contraseña utilizada anteriormente.',
          );
        }
      }
    }

    const newHistory = historyRepo.create({
      passwordHash: user.password,
      user: user,
    });
    await historyRepo.save(newHistory);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null as any;
    user.resetPasswordExpires = null as any;
    user.resetPasswordAttempts = 0;
    user.tokenVersion += 1;

    await userRepo.save(user);

    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Contraseña actualizada - Eco Bocado',
        template: './reset-confirmation',
      })
      .catch(console.error);

    return { message: 'Contraseña actualizada correctamente.' };
  }
}
