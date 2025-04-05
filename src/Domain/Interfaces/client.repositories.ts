import { RequestClientDTO } from 'src/Presentation/DTOs/request-cliente.dto';
import { Client } from '../Entities/client.entity';
import { ResponseClientDTO } from 'src/Presentation/DTOs/response-cliente.dto';

export abstract class IClientRepository {
  findAll: (filters: RequestClientDTO) => Promise<Client[]>;
  findByClientNumber: (clientNumber: string) => Promise<Client | null>;
  create: (clientNumber: string, name: string) => Promise<Client>;
}
