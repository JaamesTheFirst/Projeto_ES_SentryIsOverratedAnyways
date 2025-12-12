import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ErrorsService } from '../errors/errors.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly errorsService: ErrorsService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req) {
    const stats = await this.errorsService.getDashboardStats(req.user.userId);
    
    // Get active projects count (we'll enhance this later)
    return {
      ...stats,
      activeProjects: 0, // TODO: Get from projects service
    };
  }

  @Get('recent-errors')
  @UseGuards(JwtAuthGuard)
  async getRecentErrors(@Request() req) {
    const stats = await this.errorsService.getDashboardStats(req.user.userId);
    return stats.recentErrors;
  }
}

