import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class RegisterCommerceDto {
  // Datos del Usuario (Dueño)
  @IsString()
  @IsNotEmpty({ message: 'El nombre del dueño es obligatorio' })
  ownerName: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  // Datos del Comercio
  @IsString()
  @IsNotEmpty({ message: 'El nombre del comercio es obligatorio' })
  commerceName: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
