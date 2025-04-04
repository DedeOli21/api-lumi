import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from '../../../Presentation/Controllers/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/Domain/Entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService], // Export ClientsService if needed in other modules
})
export class ClientsModule {}
