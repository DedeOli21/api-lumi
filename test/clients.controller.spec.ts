import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../../../Presentation/Controllers/clients.controller';
import { ClientsService } from './clients.service';
import { Client } from '../entities/client.entity';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: 1, name: 'Client 1' },
              { id: 2, name: 'Client 2' },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result: Client[] = await controller.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
