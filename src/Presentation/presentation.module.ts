import { Module } from '@nestjs/common';
import { ApplicationModule } from 'src/Application/application.module';
import { ClientsController } from './Controllers/clients.controller';
import { DashboardController } from './Controllers/dashboard.controller';
import { InvoicesController } from './Controllers/invoices.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [ClientsController, DashboardController, InvoicesController],
})
export class PresentationModule {}
