import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { Invoice } from 'src/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Invoice])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
