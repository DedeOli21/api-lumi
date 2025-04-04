import { Module } from '@nestjs/common';
import { ClientsModule } from './Services/clients/clients.module';
import { DashBoardModule } from './Services/dashboard/dashboard.module';
import { InvoicesModule } from './Services/invoices/invoices.module';

const services = [ClientsModule, InvoicesModule, DashBoardModule];

@Module({
  imports: services,
  exports: services,
})
export class ApplicationModule {}
