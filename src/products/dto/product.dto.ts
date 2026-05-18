import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio original debe ser un número' })
  @Min(0)
  originalPrice: number;

  @IsNumber({}, { message: 'El precio de oferta debe ser un número' })
  @Min(0)
  price: number;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1)
  quantity: number;

  @IsDateString({}, { message: 'Fecha de vencimiento inválida' })
  @IsOptional()
  expiryDate?: string;

  @IsDateString({}, { message: 'Hora límite de recojo inválida' })
  @IsOptional()
  pickupDeadline?: string;

  @IsUUID('all', { message: 'ID de comercio inválido' })
  @IsNotEmpty({ message: 'El ID del comercio es obligatorio' })
  commerceId: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  originalPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsDateString()
  @IsOptional()
  pickupDeadline?: string;
}
