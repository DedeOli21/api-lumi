import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/Domain/Entities/client.entity';
import { IClientRepository } from 'src/Domain/Interfaces/client.repositories';
import { RequestClientDTO } from 'src/Presentation/DTOs/request-cliente.dto';
import { Repository } from 'typeorm';

export class ClientImpl implements IClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(filters: RequestClientDTO): Promise<Client[]> {
    const { numberClient, clientName } = filters;

    const query = this.clientRepository
      .createQueryBuilder('client')
      .select(['client.clientNumber', 'client.name', 'client.id']);

    if (numberClient) {
      query.andWhere('client.clientNumber = :numberClient', { numberClient });
    }
    if (clientName) {
      query.andWhere('client.name LIKE :clientName', {
        clientName: `%${clientName}%`,
      });
    }
    return query.getMany();
  }

  async findByClientNumber(clientNumber: string): Promise<Client | null> {
    return this.clientRepository.findOne({ where: { clientNumber } });
  }

  async create(clientNumber: string, name: string): Promise<Client> {
    const newClient = this.clientRepository.create({
      clientNumber,
      name,
    });
    return this.clientRepository.save(newClient);
  }
}
