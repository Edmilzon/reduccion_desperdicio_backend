import { IsNumber, Min, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNumber({}, { message: 'ID de producto inválido' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  productId: number;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity: number;

  @IsEnum(PaymentMethod, { message: 'Método de pago inválido' })
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
