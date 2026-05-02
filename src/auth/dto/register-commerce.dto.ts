import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class RegisterCommerceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del dueño es obligatorio' })
  ownerName: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del restaurante es obligatorio' })
  commerceName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Latitud inválida' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Longitud inválida' })
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  nit?: string;
}
