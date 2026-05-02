import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCommerceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del restaurante es obligatorio' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Latitud inválida' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Longitud inválida' })
  @IsOptional()
  longitude?: number;

  @IsNumber({}, { message: 'Rating inválido' })
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  nit?: string;
}

export class UpdateCommerceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Latitud inválida' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Longitud inválida' })
  @IsOptional()
  longitude?: number;

  @IsNumber({}, { message: 'Rating inválido' })
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  nit?: string;
}
