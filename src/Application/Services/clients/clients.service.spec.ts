import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { Client } from 'src/Domain/Entities/client.entity';
import { IClientRepository } from 'src/Domain/Interfaces/client.repositories';
import { RequestClientDTO } from 'src/Presentation/DTOs/request-cliente.dto';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientRepository: IClientRepository;

  const mockClients = [
    { id: 1, name: 'Client 1', invoices: [] },
    { id: 2, name: 'Client 2', invoices: [] },
  ];

  const mockClientRepo = {
    findAll: jest.fn().mockResolvedValue(mockClients),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: 'IClientRepository',
          useValue: mockClientRepo,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    clientRepository = module.get<IClientRepository>('IClientRepository');
  });

  describe('findAllClient', () => {
    it('should return an array of ResponseClientDTO', async () => {
      const filters: RequestClientDTO = {};

      const result = await service.findAllClient(filters);

      expect(result).toEqual([
        { data: [mockClients[0]] },
        { data: [mockClients[1]] },
      ]);

      expect(clientRepository.findAll).toHaveBeenCalledWith(filters);
      expect(clientRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
