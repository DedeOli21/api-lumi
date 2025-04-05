import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from '../../../Presentation/Controllers/clients.controller';
import { IClientRepository } from 'src/Domain/Interfaces/client.repositories';
import { ClientImpl } from 'src/Infra/Database/client.impl';

@Module({
  imports: [],
  providers: [
    ClientsService
  ],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
