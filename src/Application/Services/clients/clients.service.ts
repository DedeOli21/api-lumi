import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'src/Domain/Entities/client.entity';
import { IClientRepository } from 'src/Domain/Interfaces/client.repositories';
import { RequestClientDTO } from 'src/Presentation/DTOs/request-cliente.dto';
import { ResponseClientDTO } from 'src/Presentation/DTOs/response-cliente.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientRepo: IClientRepository
  ) {}

  async findAllClient(
    filters?: RequestClientDTO,
  ): Promise<ResponseClientDTO[]> {
    const clients = await this.clientRepo.findAll(filters);
    return clients
  }
}
