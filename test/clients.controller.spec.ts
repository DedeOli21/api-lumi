import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from 'src/Application/Services/clients/clients.service';
import { ClientsController } from 'src/Presentation/Controllers/clients.controller';
import { ResponseClientDTO } from 'src/Presentation/DTOs/response-cliente.dto';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  const mockClients: ResponseClientDTO[] = [
    {
      data: [
        {
          id: 1,
          name: 'Client 1',
          clientNumber: '001',
        },
      ],
    },
    {
      data: [
        {
          id: 2,
          name: 'Client 2',
          clientNumber: '002',
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            findAllClient: jest.fn().mockResolvedValue(mockClients),
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
      const params = {
        numberClient: '001',
        clientName: 'Client 1',
      };
      const result = await controller.findAll(params.clientName, params.numberClient);

      expect(result).toEqual(mockClients);
      expect(service.findAllClient).toHaveBeenCalledWith({"clientName": "Client 1", "numberClient": "001"});
      expect(service.findAllClient).toHaveBeenCalledTimes(1);
    });
  });
});
