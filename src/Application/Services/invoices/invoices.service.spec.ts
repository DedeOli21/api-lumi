import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Invoice } from '../entities/invoice.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import pdf from 'pdf-parse';
import { Repository } from 'typeorm';

jest.mock('pdf-parse');

describe('InvoicesService', () => {
  let service: InvoicesService;
  let clientRepo: Repository<Client>;
  let invoiceRepo: Repository<Invoice>;

  const mockClientRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockInvoiceRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepo,
        },
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockInvoiceRepo,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    clientRepo = module.get<Repository<Client>>(getRepositoryToken(Client));
    invoiceRepo = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractInvoiceData', () => {
    it('should extract invoice data from a valid PDF buffer', async () => {
      const mockPdfBuffer = Buffer.from('mock-pdf');
      const mockPdfText = `
        1234567890 1234567890
        Referente JAN/2023
        Energia Elétrica kWh 100
        Energia compensada GD I kWh 50
        Energia Elétrica 100,00
        Energia compensada GD I -50,00
      `;
      (pdf as jest.Mock).mockResolvedValue({ text: mockPdfText });

      const result = await service.extractInvoiceData(mockPdfBuffer);

      expect(result).toEqual({
        clientNumber: '1234567890',
        monthReference: 'JAN/2023',
        energyConsumptionKwh: 100,
        energyCompensatedKwh: 50,
        totalValueWithoutGd: 100,
        gdEconomyValue: -50,
      });
    });

    it('should throw BadRequestException for invalid PDF data', async () => {
      const mockPdfBuffer = Buffer.from('mock-pdf');
      (pdf as jest.Mock).mockResolvedValue({ text: '' });

      await expect(service.extractInvoiceData(mockPdfBuffer)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findFiltered', () => {
    it('should return filtered invoices', async () => {
      const mockInvoices = [{ id: 1 }, { id: 2 }];
      mockInvoiceRepo.createQueryBuilder().getMany.mockResolvedValue(mockInvoices);

      const result = await service.findFiltered(1, '01', '2023');

      expect(result).toEqual(mockInvoices);
      expect(mockInvoiceRepo.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('processAndSaveInvoice', () => {
    it('should process and save an invoice', async () => {
      const mockPdfBuffer = Buffer.from('mock-pdf');
      const mockInvoiceData = {
        clientNumber: '1234567890',
        monthReference: 'JAN/2023',
        energyConsumptionKwh: 100,
        energyCompensatedKwh: 50,
        totalValueWithoutGd: 100,
        gdEconomyValue: -50,
      };
      const mockClient = { id: 1, clientNumber: '1234567890' };
      const mockInvoice = { id: 1, ...mockInvoiceData };

      jest.spyOn(service, 'extractInvoiceData').mockResolvedValue(mockInvoiceData);
      mockClientRepo.findOne.mockResolvedValue(mockClient);
      mockInvoiceRepo.create.mockReturnValue(mockInvoice);
      mockInvoiceRepo.save.mockResolvedValue(mockInvoice);

      const result = await service.processAndSaveInvoice(mockPdfBuffer);

      expect(result).toEqual(mockInvoice);
      expect(service.extractInvoiceData).toHaveBeenCalledWith(mockPdfBuffer);
      expect(mockClientRepo.findOne).toHaveBeenCalledWith({ where: { clientNumber: '1234567890' } });
      expect(mockInvoiceRepo.create).toHaveBeenCalledWith({
        ...mockInvoiceData,
        clientId: mockClient.id,
        pdfPath: expect.any(String),
      });
      expect(mockInvoiceRepo.save).toHaveBeenCalledWith(mockInvoice);
    });

    it('should throw BadRequestException for invalid PDF processing', async () => {
      const mockPdfBuffer = Buffer.from('mock-pdf');
      jest.spyOn(service, 'extractInvoiceData').mockRejectedValue(new BadRequestException());

      await expect(service.processAndSaveInvoice(mockPdfBuffer)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return an invoice if found', async () => {
      const mockInvoice = { id: 1, pdfPath: 'path/to/pdf' };
      mockInvoiceRepo.findOne.mockResolvedValue(mockInvoice);

      const result = await service.findOne(1);

      expect(result).toEqual(mockInvoice);
      expect(mockInvoiceRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  })
})
