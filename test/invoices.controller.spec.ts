import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesController } from 'src/Presentation/Controllers/invoices.controller';
import { InvoicesService } from 'src/Application/Services/invoices/invoices.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  const mockInvoicesService = {
    findFiltered: jest.fn().mockResolvedValue([
      { id: 1, clientId: 1, monthReference: '2023-01' },
      { id: 2, clientId: 2, monthReference: '2023-02' },
    ]),
    processAndSaveInvoice: jest.fn().mockResolvedValue({ success: true }),
    findOne: jest.fn() as jest.Mock,
    getAvailableYears: jest
      .fn()
      .mockResolvedValue([{ monthReference: '2023' }]),
    getAvailableMonths: jest
      .fn()
      .mockResolvedValue([{ monthReference: 'January' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findFiltered', () => {
    it('should return filtered invoices', async () => {
      const result = await controller.findFiltered(1, '01', '2023');
      expect(result).toEqual([
        { id: 1, clientId: 1, monthReference: '2023-01' },
        { id: 2, clientId: 2, monthReference: '2023-02' },
      ]);
      expect(service.findFiltered).toHaveBeenCalledWith(1, '01', '2023');
    });
  });

  describe('upload', () => {
    it('should process and save an invoice', async () => {
      const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;
      const result = await controller.upload(mockFile);
      expect(result).toEqual({ success: true });
      expect(service.processAndSaveInvoice).toHaveBeenCalledWith(
        mockFile.buffer,
      );
    });
  });

  describe('downloadInvoice', () => {
    it('should throw NotFoundException if invoice is not found', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(null);
      const mockRes = {} as Response;

      await expect(controller.downloadInvoice(1, mockRes)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findYears', () => {
    it('should return available years', async () => {
      const result = await controller.findYears();
      expect(result).toEqual(['2023']);
      expect(service.getAvailableYears).toHaveBeenCalled();
    });
  });

  describe('findMonths', () => {
    it('should return available months for a given year and client', async () => {
      const result = await controller.findMonths('2023', 1);
      expect(result).toEqual(['January']);
      expect(service.getAvailableMonths).toHaveBeenCalledWith('2023', 1);
    });
  });
});
