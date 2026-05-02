import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: AuthRequest) {
    return this.ordersService.create(createOrderDto, req.user);
  }

  @Get('my-orders')
  findMyOrders(@Request() req: AuthRequest) {
    return this.ordersService.findMyOrders(req.user);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.ordersService.cancelOrder(+id, req.user);
  }
}
