import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from '../../../Presentation/Controllers/dashboard.controller';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashBoardModule {}
