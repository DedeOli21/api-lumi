
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from '../../../Presentation/Controllers/dashboard.controller';
import { Client } from 'src/Domain/Entities/client.entity';
import { Invoice } from 'src/Domain/Entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Invoice])],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService], // Export DashboardService if needed in other modules
})
export class DashBoardModule {}
