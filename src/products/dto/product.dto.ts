import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El título del producto es obligatorio' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio original debe ser un número' })
  @Min(0)
  originalPrice: number;

  @IsNumber({}, { message: 'El precio de descuento debe ser un número' })
  @Min(0)
  price: number;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsDateString({}, { message: 'Fecha de inicio de recogida inválida' })
  @IsNotEmpty({ message: 'La fecha de inicio de recogida es obligatoria' })
  pickupStart: string;

  @IsDateString({}, { message: 'Fecha de fin de recogida inválida' })
  @IsNotEmpty({ message: 'La fecha de fin de recogida es obligatoria' })
  pickupEnd: string;

  @IsNumber({}, { message: 'ID de comercio inválido' })
  @IsNotEmpty({ message: 'El ID del comercio es obligatorio' })
  commerceId: number;

  @IsNumber({}, { message: 'ID de categoría inválido' })
  @IsOptional()
  categoryId?: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string;

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

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsDateString()
  @IsOptional()
  pickupStart?: string;

  @IsDateString()
  @IsOptional()
  pickupEnd?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
