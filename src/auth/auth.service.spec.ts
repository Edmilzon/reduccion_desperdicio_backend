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

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Test incorrect login', () => {
    it('should throw UnauthorizedException if the user does not exist', async () => {
      usersService.findWithPasswordByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'notexists@email.com', password: '123' }),
      ).rejects.toThrow(new UnauthorizedException('Credenciales inválidas'));
    });

    it('should throw UnauthorizedException if the password is incorrect', async () => {
      const mockUser: any = {
        id: 1,
        email: 'test@email.com',
        password: 'hashedPassword',
        role: 'CLIENT',
      };
      usersService.findWithPasswordByEmail.mockResolvedValue(mockUser);

      // Simulate bcrypt.compare returning false (incorrect password)
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@email.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(new UnauthorizedException('Credenciales inválidas'));
    });
  });
});
