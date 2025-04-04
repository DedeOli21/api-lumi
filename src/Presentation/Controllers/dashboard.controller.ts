import { Controller, Get, Query, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DashboardService } from '../../Application/Services/dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  
  @Get()
  async getDashboard(@Query('client_id') clientId: number) {
    return this.dashboardService.getDashboard(clientId);
  }
}

