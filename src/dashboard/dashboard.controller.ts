import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('commerce/:commerceId')
  getCommerceStats(
    @Param('commerceId') commerceId: string,
    @Request() req: AuthRequest,
  ) {
    return this.dashboardService.getCommerceStats(+commerceId, req.user);
  }
}
