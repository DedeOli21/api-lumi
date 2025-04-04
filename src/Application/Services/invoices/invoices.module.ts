import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from '../../../Presentation/Controllers/invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/Domain/Entities/client.entity';
import { Invoice } from 'src/Domain/Entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Invoice])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService], // Export InvoicesService if needed in other modules
})
export class InvoicesModule {}
