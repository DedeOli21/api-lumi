import { Controller, Get, Query } from '@nestjs/common';
import { ClientsService } from '../../Application/Services/clients/clients.service';
import { ResponseClientDTO } from '../DTOs/response-cliente.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(
    @Query('number_client') numberClient: string,
    @Query('client_name') clientName: string,
  ): Promise<ResponseClientDTO[]> {
    return this.clientsService.findAllClient({numberClient, clientName});
  }
}
