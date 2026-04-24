import { IsUUID, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsUUID('all', { message: 'ID de producto inválido' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  productId: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity: number;
}
