import { IsNotEmpty, IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateCommerceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del comercio es obligatorio' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateCommerceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
