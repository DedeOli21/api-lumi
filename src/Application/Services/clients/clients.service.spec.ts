import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Repository } from 'typeorm';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientRepo: Repository<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            find: jest.fn().mockResolvedValue([
              { id: 1, name: 'Client 1' },
              { id: 2, name: 'Client 2' },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    clientRepo = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result = await service.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' },
      ]);
      expect(clientRepo.find).toHaveBeenCalled();
    });
  });
});
