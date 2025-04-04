import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from 'src/Application/Services/clients/clients.service';
import { ClientsController } from 'src/Presentation/Controllers/clients.controller';

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
      const result = await controller.findAll('1', 'Client 1');
      expect(result).toEqual([
        { id: 1, name: 'Client 1', invoices: [] },
        { id: 2, name: 'Client 2', invoices: [] },
      ]);
      expect(service.findAllClient).toHaveBeenCalled();
    });
  });
});
