import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CommercesService } from '../commerces/commerces.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;

  beforeEach(async () => {
    usersService = {
      findWithPasswordByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: CommercesService, useValue: {} },
        { provide: JwtService, useValue: {} },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('debería estar definido', () => {
    expect(authService).toBeDefined();
  });

  describe('Probar login incorrecto', () => {
    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      usersService.findWithPasswordByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'noexiste@correo.com', password: '123' }),
      ).rejects.toThrow(new UnauthorizedException('Credenciales inválidas'));
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const mockUser: any = {
        id: 1,
        email: 'test@correo.com',
        password: 'hashedPassword',
        role: 'CLIENT',
      };
      usersService.findWithPasswordByEmail.mockResolvedValue(mockUser);

      // Simulamos que bcrypt.compare devuelve false (contraseña incorrecta)
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@correo.com', password: 'wrongPassword' }),
      ).rejects.toThrow(new UnauthorizedException('Credenciales inválidas'));
    });
  });
});
