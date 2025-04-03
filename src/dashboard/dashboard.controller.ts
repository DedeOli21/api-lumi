import { Controller, Get, Query, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Invoice } from '../entities/invoice.entity';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  
  @Get()
  async getDashboard(@Query('client_id') clientId: number) {
    return this.dashboardService.getDashboard(clientId);
  }
}

