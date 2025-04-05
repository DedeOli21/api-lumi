import { Controller, Get, Query } from '@nestjs/common';
import { ClientsService } from '../../Application/Services/clients/clients.service';
import { ResponseClientDTO } from '../DTOs/response-cliente.dto';
import { Client } from 'src/Domain/Entities/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(
    @Query('client_name') clientName?: string,
    @Query('number_client') numberClient?: string,
  ): Promise<ResponseClientDTO[]> {
    return this.clientsService.findAllClient({ numberClient, clientName });
  }
}
