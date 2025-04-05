import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import pdf from 'pdf-parse';

jest.mock('pdf-parse');

describe('InvoicesService', () => {
  let service: InvoicesService;

  const mockClientRepo = {
    findByClientNumber: jest.fn(),
    create: jest.fn(),
  };

  const mockInvoiceRepo = {
    findById: jest.fn(),
    findFiltered: jest.fn(),
    getAvailableYears: jest.fn(),
    getAvailableMonths: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    (pdf as jest.Mock).mockResolvedValue({
      text: `
        1234567890 1234567890
        Referente JAN/2023
        Energia Elétrica kWh 100
        Energia compensada GD I kWh 50
        Energia Elétrica 100,00
        Energia compensada GD I -50,00
      `,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: 'IClientRepository',
          useValue: mockClientRepo,
        },
        {
          provide: 'IInvoiceRepository',
          useValue: mockInvoiceRepo,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractInvoiceData', () => {
    it('should extract invoice data from a valid PDF buffer', async () => {
      const result = await service.extractInvoiceData(Buffer.from('pdf'));

      expect(result).toEqual({
        clientNumber: '1234567890',
        monthReference: 'JAN/2023',
        energyConsumptionKwh: 100,
        energyCompensatedKwh: 50,
        totalValueWithoutGd: 100,
        gdEconomyValue: -50,
      });
    });

    it('should throw BadRequestException for invalid PDF', async () => {
      (pdf as jest.Mock).mockResolvedValue({ text: '' });

      await expect(service.extractInvoiceData(Buffer.from('pdf'))).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('processAndSaveInvoice', () => {
    it('should process and save an invoice', async () => {
      const mockInvoiceData = {
        clientNumber: '1234567890',
        monthReference: 'JAN/2023',
        energyConsumptionKwh: 100,
        energyCompensatedKwh: 50,
        totalValueWithoutGd: 100,
        gdEconomyValue: -50,
      };

      const mockClient = { id: 1, clientNumber: '1234567890' };
      const mockInvoice = { id: 1, ...mockInvoiceData, clientId: 1, pdfPath: 'path' };

      jest.spyOn(service, 'extractInvoiceData').mockResolvedValue(mockInvoiceData);
      mockClientRepo.findByClientNumber.mockResolvedValue(mockClient);
      mockInvoiceRepo.create.mockResolvedValue(mockInvoice);

      const result = await service.processAndSaveInvoice(Buffer.from('pdf'));

      expect(result).toEqual(mockInvoice);
      expect(mockClientRepo.findByClientNumber).toHaveBeenCalledWith('1234567890');
      expect(mockInvoiceRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        ...mockInvoiceData,
        clientId: 1,
        pdfPath: expect.any(String),
      }));
    });

    it('should throw BadRequestException when processing fails', async () => {
      jest.spyOn(service, 'extractInvoiceData').mockRejectedValue(new Error('fail'));

      await expect(service.processAndSaveInvoice(Buffer.from('pdf'))).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return invoice if found and has pdfPath', async () => {
      const invoice = { id: 1, pdfPath: 'path/to/file.pdf' };
      mockInvoiceRepo.findById.mockResolvedValue(invoice);

      const result = await service.findOne(1);
      expect(result).toEqual(invoice);
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      mockInvoiceRepo.findById.mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if pdfPath is missing', async () => {
      mockInvoiceRepo.findById.mockResolvedValue({ id: 1 });

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findFiltered', () => {
    it('should return filtered invoices', async () => {
      const invoices = [{ id: 1 }, { id: 2 }];
      mockInvoiceRepo.findFiltered.mockResolvedValue(invoices);

      const result = await service.findFiltered(1, '01', '2023');

      expect(result).toEqual(invoices);
      expect(mockInvoiceRepo.findFiltered).toHaveBeenCalledWith(1, '01', '2023');
    });
  });

  describe('getAvailableYears', () => {
    it('should return available years', async () => {
      const years = [2022, 2023];
      mockInvoiceRepo.getAvailableYears.mockResolvedValue(years);

      const result = await service.getAvailableYears();

      expect(result).toEqual(years);
    });
  });

  describe('getAvailableMonths', () => {
    it('should return available months with clientId', async () => {
      const months = ['01', '02'];
      mockInvoiceRepo.getAvailableMonths.mockResolvedValue(months);

      const result = await service.getAvailableMonths('2023', 1);

      expect(result).toEqual(months);
      expect(mockInvoiceRepo.getAvailableMonths).toHaveBeenCalledWith('2023', 1);
    });

    it('should return available months without clientId', async () => {
      const months = ['03', '04'];
      mockInvoiceRepo.getAvailableMonths.mockResolvedValue(months);

      const result = await service.getAvailableMonths('2023');

      expect(result).toEqual(months);
      expect(mockInvoiceRepo.getAvailableMonths).toHaveBeenCalledWith('2023', undefined);
    });
  });
});
