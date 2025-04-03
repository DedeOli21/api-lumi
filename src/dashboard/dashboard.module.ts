
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Invoice])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashBoardModule {}
